import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, MessageSquare, Star } from "lucide-react";
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

export const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    categories: {} as Record<string, number>,
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await supabase
          .from('feedbacks')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          setFeedbacks(data);
          
          const avgRating = data.length > 0 
            ? data.reduce((acc, f) => acc + f.rating, 0) / data.length 
            : 0;
          
          const categories = data.reduce((acc, f) => {
            acc[f.category] = (acc[f.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          setStats({
            total: data.length,
            avgRating: Math.round(avgRating * 10) / 10,
            categories,
          });
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();

    const channel = supabase
      .channel('feedbacks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => {
        fetchFeedbacks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Monitor and analyze student feedback</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.avgRating}/5</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{Object.keys(stats.categories).length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter(f => f.is_anonymous).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest submissions from students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">
                    {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{feedback.category}</Badge>
                  </TableCell>
                  <TableCell>{feedback.subject || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {feedback.rating}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.feedback_text}
                  </TableCell>
                  <TableCell>
                    <Badge variant={feedback.is_anonymous ? "secondary" : "default"}>
                      {feedback.is_anonymous ? 'Anonymous' : 'Named'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
