"use client";

import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SendMessage = () => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/whatsapp/send`,
        {
          sessionId: "default", // Sementara pakai 'default' session
          to: `${to}@c.us`,
          message,
        },
        { withCredentials: true }
      );
      toast.success("Message status", {
        description: ` Message sent to ${to} successfully`,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-3 p-3">
      <Card className="w-[400px] p-4">
        <CardContent className="space-y-4">
          <Input
            placeholder="Phone Number (62xxxx)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMessage;
