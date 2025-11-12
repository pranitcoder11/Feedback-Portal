import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { MessageSquare, History, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    thisWeek: 0,
    avgRating: 0,
  });
  const feedbackUrl = `${window.location.origin}/feedback`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: feedbacks } = await supabase
          .from('feedbacks')
          .select('rating, created_at')
          .eq('student_id', user.id);

        if (feedbacks) {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          
          const thisWeek = feedbacks.filter(f => new Date(f.created_at) > weekAgo).length;
          const avgRating = feedbacks.length > 0 
            ? feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbacks.length 
            : 0;

          setStats({
            totalFeedbacks: feedbacks.length,
            thisWeek,
            avgRating: Math.round(avgRating * 10) / 10,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Welcome Back!</h2>
        <p className="text-muted-foreground">Share your valuable feedback</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalFeedbacks}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.avgRating || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>QR Code - Quick Feedback</CardTitle>
            <CardDescription>Scan to access feedback form instantly</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <QRCodeSVG value={feedbackUrl} size={200} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Share this QR code with others or scan it yourself
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-2" 
              onClick={() => navigate('/feedback')}
            >
              <MessageSquare className="h-4 w-4" />
              Submit New Feedback
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate('/history')}
            >
              <History className="h-4 w-4" />
              View Feedback History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-hero shadow-elegant">
        <CardHeader>
          <CardTitle>💡 Why Your Feedback Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">✓ Helps improve course quality and teaching methods</p>
          <p className="text-sm">✓ Ensures your voice is heard anonymously</p>
          <p className="text-sm">✓ Contributes to better academic environment</p>
          <p className="text-sm">✓ Shapes future curriculum development</p>
        </CardContent>
      </Card>
    </div>
  );
};
