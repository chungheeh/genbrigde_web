'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SeniorHeader } from "@/features/senior/components/SeniorHeader";
import { AutoTutorial } from '@/features/tutorial/components/AutoTutorial';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { containsProhibitedWords } from '@/lib/validation';
import { addPoints } from '@/features/points/api';

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  status: 'pending' | 'answered' | 'completed';
  answers?: Answer[];
  satisfaction?: 'neutral' | 'good' | 'excellent';
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  is_selected: boolean;
  user_id: string;
}

export default function AnswersPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [selectedAnswerInfo, setSelectedAnswerInfo] = useState<{
    questionId: string;
    answerId: string;
  } | null>(null);

  const fetchQuestions = async () => {
    try {
      // 사용자 정보 가져오기
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError) {
        console.error('Session error:', JSON.stringify(sessionError));
        toast.error('사용자 정보를 가져오는데 실패했습니다.');
        return;
      }

      if (!sessionData.user) {
        toast.error('로그인이 필요합니다.');
        return;
      }

      // 질문 목록 가져오기
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          title,
          content,
          created_at,
          status,
          category,
          satisfaction
        `)
        .eq('user_id', sessionData.user.id)
        .order('created_at', { ascending: false });

      if (questionsError) {
        console.error('Questions error:', JSON.stringify(questionsError));
        toast.error('질문을 불러오는데 실패했습니다: ' + (questionsError.message || '알 수 없는 오류가 발생했습니다.'));
        return;
      }

      if (!questionsData) {
        setQuestions([]);
        return;
      }

      // 답변 정보 가져오기
      try {
        const questionsWithAnswers = await Promise.all(
          questionsData.map(async (question) => {
            try {
              const { data: answers, error: answersError } = await supabase
                .from('answers')
                .select(`
                  id,
                  content,
                  created_at,
                  is_selected,
                  user_id
                `)
                .eq('question_id', question.id)
                .order('created_at', { ascending: false });

              if (answersError) {
                console.error('Answers error for question ${question.id}:', JSON.stringify(answersError));
                return { ...question, answers: [] };
              }

              return { ...question, answers: answers || [] };
            } catch (error) {
              console.error('Error processing answers for question ${question.id}:', error);
              return { ...question, answers: [] };
            }
          })
        );

        setQuestions(questionsWithAnswers);
      } catch (answersError) {
        console.error('Error fetching answers:', answersError);
        // 답변 정보를 가져오는데 실패하더라도 질문 목록은 표시
        setQuestions(questionsData.map(q => ({ ...q, answers: [] })));
        toast.error('답변 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('예기치 않은 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();

    // 실시간 구독 설정
    const questionsChannel = supabase
      .channel('senior_questions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'questions'
        },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    const answersChannel = supabase
      .channel('senior_answers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answers'
        },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    // 주기적인 데이터 갱신 (1분마다)
    const interval = setInterval(() => {
      fetchQuestions();
    }, 60000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(questionsChannel);
      supabase.removeChannel(answersChannel);
    };
  }, [supabase]);

  const handleAcceptConfirm = (questionId: string, answerId: string) => {
    setSelectedAnswerInfo({ questionId, answerId });
    setShowSatisfactionModal(true);
  };

  const handleSatisfactionSelect = async (satisfaction: 'neutral' | 'good' | 'excellent') => {
    if (!selectedAnswerInfo) return;

    try {
      // 답변 정보 가져오기
      const { data: answerData, error: answerFetchError } = await supabase
        .from('answers')
        .select('user_id')
        .eq('id', selectedAnswerInfo.answerId)
        .single();

      if (answerFetchError) throw answerFetchError;
      if (!answerData || !answerData.user_id) throw new Error('답변 정보를 찾을 수 없습니다.');

      // 답변 상태 업데이트
      const { error: answerError } = await supabase
        .from('answers')
        .update({ is_selected: true })
        .eq('id', selectedAnswerInfo.answerId);

      if (answerError) throw answerError;

      // 질문 상태와 만족도 업데이트
      const { error: questionError } = await supabase
        .from('questions')
        .update({ 
          status: 'completed',
          satisfaction: satisfaction 
        })
        .eq('id', selectedAnswerInfo.questionId);

      if (questionError) throw questionError;

      // 포인트 부여
      const pointsAmount = satisfaction === 'excellent' ? 5 : satisfaction === 'good' ? 3 : 1;
      const pointsDescription = satisfaction === 'excellent' 
        ? '답변이 매우 좋아요로 채택되었습니다.' 
        : satisfaction === 'good'
        ? '답변이 좋아요로 채택되었습니다.'
        : '답변이 채택되었습니다.';
      
      const { success, message } = await addPoints(
        answerData.user_id,
        pointsAmount,
        pointsDescription,
        selectedAnswerInfo.answerId
      );

      if (!success) {
        console.error('포인트 부여 실패:', message);
      }

      toast.success('답변이 채택되었습니다.');
      await fetchQuestions();
    } catch (error) {
      console.error('Error accepting answer:', error);
      toast.error('답변 채택에 실패했습니다.');
    } finally {
      setSelectedAnswerInfo(null);
      setShowSatisfactionModal(false);
    }
  };

  const handleRejectAnswer = async (answerId: string) => {
    try {
      const { error } = await supabase
        .from('answers')
        .update({ is_selected: false })
        .eq('id', answerId);

      if (error) throw error;

      toast.success('답변이 불채택되었습니다.');
      await fetchQuestions();
    } catch (error) {
      console.error('Error rejecting answer:', error);
      toast.error('답변 불채택에 실패했습니다.');
    }
  };

  const renderContent = (content: string) => {
    if (containsProhibitedWords(content)) {
      return '부적절한 표현이 포함된 내용입니다.';
    }
    return content;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SeniorHeader />

      {/* 자동 튜토리얼 */}
      <AutoTutorial />

      <div className="senior-nav">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex gap-8">
            <Link 
              href="/senior/ask"
              className="py-4 text-lg font-medium text-neutral-400 hover:text-neutral-600"
            >
              질문하기
            </Link>
            <Link 
              href="/senior/answers"
              className="py-4 text-lg font-medium border-b-2 border-[#00C73C] text-[#00C73C]"
            >
              답변 확인
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">답변 확인</h1>
            <Button 
              asChild
              className="bg-[#00C73C] hover:bg-[#00912C] text-white rounded-full h-10 px-4 flex items-center gap-2"
            >
              <Link href="/senior/ask">
                <span className="text-xl font-bold">+</span>
                <span>질문하기</span>
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>답변을 불러오는 중입니다...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">아직 등록한 질문이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-6 space-y-4">
                  {/* 질문 */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
                    <p className="text-gray-600 mb-2">{renderContent(question.content)}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        question.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : question.status === 'answered'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {question.status === 'completed' 
                          ? '채택 완료'
                          : question.status === 'answered'
                          ? '답변 완료'
                          : '답변 대기중'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {format(new Date(question.created_at), 'yyyy년 MM월 dd일 HH시 mm분')}
                      </span>
                    </div>
                  </div>

                  {/* 답변 목록 */}
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-medium">
                      답변 {question.answers?.length ?? 0}개
                    </h3>
                    {question.answers && question.answers.length > 0 ? (
                      question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`rounded-lg p-4 space-y-2 ${
                            answer.is_selected 
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <p className="text-gray-800">{renderContent(answer.content)}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                              {format(new Date(answer.created_at), 'yyyy년 MM월 dd일 HH시 mm분')}
                            </p>
                            {!question.answers?.some(a => a.is_selected) && (
                              <div className="flex gap-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      채택하기
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>답변 채택</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        이 답변을 채택하시겠습니까? 채택 후에는 다른 답변을 채택할 수 없습니다.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>취소</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAcceptConfirm(question.id, answer.id)}
                                      >
                                        채택하기
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      불채택
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>답변 불채택</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        이 답변을 불채택하시겠습니까?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>취소</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleRejectAnswer(answer.id)}
                                      >
                                        불채택하기
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                            {answer.is_selected && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-medium flex items-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  채택된 답변
                                </span>
                                {question.satisfaction && (
                                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                                    question.satisfaction === 'excellent' 
                                      ? 'bg-green-100 text-green-800'
                                      : question.satisfaction === 'good'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {question.satisfaction === 'neutral' && '그저 그래요 😐'}
                                    {question.satisfaction === 'good' && '좋아요 😊'}
                                    {question.satisfaction === 'excellent' && '매우 좋아요 😍'}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">아직 답변이 없습니다.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 만족도 선택 Dialog */}
      <Dialog open={showSatisfactionModal} onOpenChange={setShowSatisfactionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>답변 만족도 평가</DialogTitle>
            <DialogDescription>
              답변에 대한 만족도를 선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => handleSatisfactionSelect('neutral')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">😐</span>
              <span>그저 그래요</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSatisfactionSelect('good')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">😊</span>
              <span>좋아요</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSatisfactionSelect('excellent')}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">😍</span>
              <span>매우 좋아요</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 