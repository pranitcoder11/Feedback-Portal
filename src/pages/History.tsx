import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { format } from "date-fns";

interface Feedback {
  id: string;
  category: string;
  subject: string | null;
  rating: number;
  feedback_text: string;
  is_anonymous: boolean;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('feedbacks')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setFeedbacks(data);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto flex h-16 items-center gap-4 px-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Feedback History</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <Card className="shadow-elegant">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No feedback submitted yet</p>
                <Button onClick={() => navigate("/feedback")}>Submit Your First Feedback</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id} className="shadow-elegant hover:shadow-glow transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{feedback.category}</CardTitle>
                        {feedback.subject && (
                          <CardDescription>{feedback.subject}</CardDescription>
                        )}
                      </div>
                      <Badge variant={feedback.is_anonymous ? "secondary" : "default"}>
                        {feedback.is_anonymous ? 'Anonymous' : 'Named'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            className={`h-5 w-5 ${
                              value <= feedback.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feedback.rating}/5
                      </span>
                    </div>
                    <p className="text-sm">{feedback.feedback_text}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {format(new Date(feedback.created_at), 'MMMM dd, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default History;
