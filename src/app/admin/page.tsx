'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";

export default function AdminDashboardPage() {
    const { profile } = useUser();
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {profile?.displayName || 'Admin'}</CardTitle>
                    <CardDescription>This is your admin dashboard. You can manage the application content from the sidebar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Select a section from the sidebar to get started.</p>
                </CardContent>
            </Card>
        </div>
    )
}