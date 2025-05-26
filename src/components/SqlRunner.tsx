"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 개발 환경에서만 사용되는 SQL 쿼리 실행 컴포넌트
 */
export default function SqlRunner() {
  const [sql, setSql] = useState('SELECT * FROM profiles LIMIT 10;');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const supabase = createClientComponentClient();

  const runQuery = async () => {
    if (!sql.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.rpc('run_sql_query', { query: sql });
      
      if (error) {
        setResult({ error: error.message });
      } else {
        setResult({ data });
      }
    } catch (error: any) {
      setResult({ error: error.message || 'SQL 쿼리 실행 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 개발 환경이 아니면 렌더링하지 않음
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          SQL 쿼리
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>SQL 쿼리 실행 (개발 전용)</CardTitle>
          <CardDescription>Supabase 데이터베이스에서 쿼리를 실행할 수 있습니다. 주의: 데이터가 변경될 수 있습니다.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SQL 쿼리를 입력하세요..."
              className="font-mono h-32"
            />
          </div>
          
          {result && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 font-semibold">쿼리 결과</div>
              <div className="p-4 max-h-80 overflow-auto">
                {result.error ? (
                  <div className="text-red-500">{result.error}</div>
                ) : (
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsVisible(false)}
          >
            닫기
          </Button>
          <Button 
            onClick={runQuery}
            disabled={isLoading || !sql.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? '실행 중...' : '쿼리 실행'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 