'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Question, submitAnswer } from '../api'
import { textValidationSchema } from '@/lib/validation'

const formSchema = z.object({
  content: z.string()
    .min(10, '답변은 최소 10자 이상이어야 합니다.')
    .max(2000, '답변은 최대 2000자까지 입력 가능합니다.')
    .pipe(textValidationSchema)
})

type FormValues = z.infer<typeof formSchema>

interface AnswerFormProps {
  question: Question
  onClose: () => void
}

export function AnswerForm({ question, onClose }: AnswerFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const { mutate: submitAnswerMutation, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        await submitAnswer(question.id, values.content)
      } catch (error) {
        console.error('Error submitting answer:', error)
        
        // 오류 메시지 매핑
        const errorMessages: Record<string, { message: string; action?: () => void }> = {
          '로그인이 필요합니다.': {
            message: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
            action: () => router.push('/auth/login')
          },
          '청년 사용자만 답변할 수 있습니다.': {
            message: '죄송합니다. 청년 사용자만 답변할 수 있습니다.'
          },
          '질문이 존재하지 않거나 이미 답변이 완료되었습니다.': {
            message: '이미 다른 사용자가 답변을 등록했거나 질문이 삭제되었습니다.',
            action: () => {
              queryClient.invalidateQueries({ queryKey: ['pendingQuestions'] })
              onClose()
            }
          }
        }

        if (error instanceof Error) {
          const errorInfo = errorMessages[error.message] || { message: error.message }
          if (errorInfo.action) {
            errorInfo.action()
          }
          throw new Error(errorInfo.message)
        }

        throw new Error('답변 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingQuestions'] })
      toast.success('답변이 성공적으로 등록되었습니다.')
      onClose()
    },
    onError: (error: Error) => {
      console.error('Error in mutation:', error)
      toast.error(error.message)
    },
  })

  const onSubmit = (values: FormValues) => {
    submitAnswerMutation(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-youth">답변 내용</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="시니어분께서 이해하기 쉽도록 자세하고 친절하게 답변해주세요..."
                  className="min-h-[200px] resize-none focus-visible:ring-youth"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="hover:bg-youth-bg hover:text-youth"
          >
            취소
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-youth hover:bg-youth-hover"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출 중...
              </>
            ) : (
              '답변 제출'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 