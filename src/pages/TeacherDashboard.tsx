import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon, TrendingUpIcon, AlertTriangleIcon } from "lucide-react";

const TeacherDashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedDate, setSelectedDate] = useState("today");

  // Mock data for insights
  const insights = [
    {
      id: 1,
      student: "Emma Thompson",
      group: "Group A - Dolphins",
      date: "2024-01-15",
      sentiment: "positive",
      summary: "Shows strong engagement with math concepts, particularly enjoyed group work.",
      keyWords: ["excited", "challenging", "teamwork"],
      concerns: [],
    },
    {
      id: 2,
      student: "Liam Johnson",
      group: "Group B - Eagles", 
      date: "2024-01-15",
      sentiment: "neutral",
      summary: "Understanding concepts but struggling with confidence in participation.",
      keyWords: ["difficult", "quiet", "thinking"],
      concerns: ["confidence", "participation"],
    },
    {
      id: 3,
      student: "Sophia Chen",
      group: "Group A - Dolphins",
      date: "2024-01-15",
      sentiment: "attention",
      summary: "Expressed frustration with reading comprehension tasks, needs additional support.",
      keyWords: ["frustrated", "confused", "help"],
      concerns: ["reading comprehension", "emotional support"],
    },
  ];

  const groupStats = {
    "Group A - Dolphins": { positive: 8, neutral: 3, attention: 2 },
    "Group B - Eagles": { positive: 6, neutral: 5, attention: 1 },
    "Group C - Lions": { positive: 7, neutral: 4, attention: 1 },
    "Group D - Owls": { positive: 9, neutral: 2, attention: 1 },
  };

  const filteredInsights = insights.filter(insight => {
    if (selectedGroup === "all") return true;
    return insight.group === selectedGroup;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-insight-positive text-success";
      case "neutral": return "bg-insight-neutral text-muted-foreground";
      case "attention": return "bg-insight-attention text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "😊";
      case "neutral": return "😐";
      case "attention": return "😟";
      default: return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-teacher-bg p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            🎓 Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights from student responses
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Filters & Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Group</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="Group A - Dolphins">Group A - Dolphins</SelectItem>
                    <SelectItem value="Group B - Eagles">Group B - Eagles</SelectItem>
                    <SelectItem value="Group C - Lions">Group C - Lions</SelectItem>
                    <SelectItem value="Group D - Owls">Group D - Owls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="teacher" className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                  <p className="text-2xl font-bold text-primary">13</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
                  <p className="text-2xl font-bold text-success">76%</p>
                </div>
                <div className="rounded-full bg-success/10 p-3">
                  <TrendingUpIcon className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                  <p className="text-2xl font-bold text-warning">5</p>
                </div>
                <div className="rounded-full bg-warning/10 p-3">
                  <AlertTriangleIcon className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold text-secondary">4</p>
                </div>
                <div className="rounded-full bg-secondary/10 p-3">
                  <UsersIcon className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Student Insights</h2>
          
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{insight.student}</CardTitle>
                    <CardDescription>{insight.group} • {insight.date}</CardDescription>
                  </div>
                  <Badge className={getSentimentColor(insight.sentiment)}>
                    {getSentimentIcon(insight.sentiment)} {insight.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground">{insight.summary}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Key Words:</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.keyWords.map((word, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {insight.concerns.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-warning">Areas of Concern:</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.concerns.map((concern, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;