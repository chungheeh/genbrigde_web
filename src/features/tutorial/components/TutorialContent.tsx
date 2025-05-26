'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircle, Bot, UserCircle, Search, Clock, Pencil, Type } from "lucide-react";

export function TutorialContent() {
  return (
    <Tabs defaultValue="main">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="main">메인 화면</TabsTrigger>
        <TabsTrigger value="ask">질문하기</TabsTrigger>
        <TabsTrigger value="answers">답변 확인</TabsTrigger>
        <TabsTrigger value="header">헤더 기능</TabsTrigger>
      </TabsList>

      {/* 메인 화면 탭 */}
      <TabsContent value="main" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00C73C]" />
              메인 페이지 안내
            </CardTitle>
            <CardDescription>
              노인 서비스 메인 페이지에 있는 요소들에 대한 설명입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-senior-bg rounded-full">
                  <HelpCircle className="w-4 h-4 text-[#00C73C]" />
                </div>
                질문하기 메뉴
              </h3>
              <p>궁금한 내용을 질문하고 청년들의 답변을 받을 수 있습니다. 이 카드를 클릭하면 질문 작성 페이지로 이동합니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-senior-bg rounded-full">
                  <Bot className="w-4 h-4 text-[#FF6B6B]" />
                </div>
                AI에게 질문하기 메뉴
              </h3>
              <p>인공지능에게 질문하고 즉시 답변을 받을 수 있습니다. 24시간 언제든지 이용 가능합니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-senior-bg rounded-full">
                  <MessageCircle className="w-4 h-4 text-[#1F8FFF]" />
                </div>
                답변 확인하기 메뉴
              </h3>
              <p>내가 작성한 질문에 대한 답변을 확인할 수 있습니다. 답변이 달리면 이곳에서 확인하세요.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-senior-bg rounded-full">
                  <UserCircle className="w-4 h-4 text-[#FFD600]" />
                </div>
                내 정보 메뉴
              </h3>
              <p>내 프로필 정보를 확인하고 관리할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-neutral-100 rounded-full">
                  <Clock className="w-4 h-4 text-neutral-600" />
                </div>
                나의 질문 섹션
              </h3>
              <p>최근에 작성한 질문 목록을 확인할 수 있습니다. 질문의 상태(답변 대기중, 답변 완료, 채택 완료)와 작성 시간을 확인할 수 있으며, 수정이나 삭제도 가능합니다.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 질문하기 탭 */}
      <TabsContent value="ask" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00C73C]" />
              질문하기 페이지 안내
            </CardTitle>
            <CardDescription>
              질문을 작성하는 페이지에 대한 설명입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">질문 작성 영역</h3>
              <p>질문 제목과 내용을 작성하는 공간입니다. 최소 10자 이상 입력해야 질문을 등록할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                텍스트 입력 방법
              </h3>
              <p>직접 키보드로 입력하거나, 하단의 녹음 버튼을 눌러 음성으로 질문을 작성할 수도 있습니다. 음성으로 말하면 자동으로 텍스트로 변환됩니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">이미지 첨부</h3>
              <p>질문과 관련된 이미지를 첨부할 수 있습니다. '이미지 첨부' 버튼을 클릭하여 기기에서 이미지를 선택하면 됩니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">질문하기 버튼</h3>
              <p>모든 내용을 작성한 후 하단의 '질문하기' 버튼을 클릭하면 질문이 등록됩니다. 청년들이 답변을 달면 알림을 받게 됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 답변 확인 탭 */}
      <TabsContent value="answers" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#1F8FFF]" />
              답변 확인 페이지 안내
            </CardTitle>
            <CardDescription>
              답변을 확인하는 페이지에 대한 설명입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" />
                질문 목록
              </h3>
              <p>내가 작성한 모든 질문 목록이 표시됩니다. 질문을 클릭하면 해당 질문에 대한 답변들을 확인할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">답변 내용</h3>
              <p>각 질문에 대한 답변 내용을 볼 수 있습니다. 여러 청년들이 답변을 달았다면 모두 확인 가능합니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">답변 채택</h3>
              <p>마음에 드는 답변이 있다면 '채택하기' 버튼을 눌러 채택할 수 있습니다. 채택된 답변은 상단에 표시되며, 답변자에게는 포인트가 지급됩니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">추가 질문</h3>
              <p>답변에 대해 추가 질문이 있다면 댓글 형태로 추가 질문을 작성할 수 있습니다.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 헤더 기능 탭 */}
      <TabsContent value="header" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Type className="w-5 h-5" />
              헤더 기능 안내
            </CardTitle>
            <CardDescription>
              상단 헤더에 있는 기능들에 대한 설명입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Type className="w-4 h-4" />
                글씨 크기 조절
              </h3>
              <p>화면 상단에 있는 'A' 모양의 버튼을 클릭하면 글씨 크기를 조절할 수 있습니다. '보통', '크게', '아주크게' 세 가지 옵션 중에서 선택할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">로그아웃</h3>
              <p>서비스를 종료하고 싶을 때 '로그아웃' 버튼을 클릭하면 로그아웃됩니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">홈</h3>
              <p>'홈' 버튼을 클릭하면 노인 서비스 메인 페이지로 이동합니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">회원</h3>
              <p>'회원' 버튼을 클릭하면 내 프로필 정보 페이지로 이동합니다.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00C73C]" />
                사용 가이드
              </h3>
              <p>물음표 아이콘을 클릭하면 이 사용 가이드를 언제든지 다시 볼 수 있습니다.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 