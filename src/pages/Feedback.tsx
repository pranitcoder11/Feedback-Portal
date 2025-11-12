import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AuthGuard } from "@/components/AuthGuard";
import { Star } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('feedbacks').insert({
        student_id: user.id,
        category,
        subject: subject || null,
        rating,
        feedback_text: feedbackText,
        is_anonymous: isAnonymous,
      });

      if (error) throw error;

      toast.success("Feedback submitted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Submit Feedback</CardTitle>
              <CardDescription>
                Your feedback helps improve the academic experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Course Content">Course Content</SelectItem>
                      <SelectItem value="Teaching Method">Teaching Method</SelectItem>
                      <SelectItem value="Facilities">Facilities</SelectItem>
                      <SelectItem value="Support Services">Support Services</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Computer Science 101"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            value <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback *</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    rows={6}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous">Submit Anonymously</Label>
                    <p className="text-sm text-muted-foreground">
                      Your identity will be hidden
                    </p>
                  </div>
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !category || rating === 0 || !feedbackText}
                    className="flex-1"
                  >
                    {loading ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Feedback;
