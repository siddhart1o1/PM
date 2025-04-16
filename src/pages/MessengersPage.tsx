import { useState } from "react";
import { messengers, Messenger, users, User } from "@/data/mockData";
import {
  MessageSquare,
  Send,
  Plus,
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

// Mock conversation data
interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

// Mock chats
const mockChats: Record<string, Chat> = {
  messenger1: {
    id: "messenger1",
    messages: [
      {
        id: "msg1",
        sender: users[0],
        content: "Hey team, any updates on the design system?",
        timestamp: "10:30 AM",
      },
      {
        id: "msg2",
        sender: users[1],
        content:
          "I've completed the button components and started work on the form elements",
        timestamp: "10:32 AM",
      },
      {
        id: "msg3",
        sender: users[2],
        content: "I need some clarification on the color palette we're using",
        timestamp: "10:35 AM",
      },
    ],
  },
  messenger2: {
    id: "messenger2",
    messages: [
      {
        id: "msg1",
        sender: users[0],
        content:
          "Let's discuss the marketing strategy for the new product launch",
        timestamp: "Yesterday",
      },
      {
        id: "msg2",
        sender: users[1],
        content: "I've prepared a draft of social media posts",
        timestamp: "Yesterday",
      },
    ],
  },
  messenger3: {
    id: "messenger3",
    messages: [
      {
        id: "msg1",
        sender: users[2],
        content: "Sprint planning starts in 30 minutes",
        timestamp: "2 days ago",
      },
      {
        id: "msg2",
        sender: users[0],
        content: "We need to prioritize the bug fixes for the next release",
        timestamp: "2 days ago",
      },
    ],
  },
  messenger4: {
    id: "messenger4",
    messages: [
      {
        id: "msg1",
        sender: users[0],
        content: "Let's review the wireframes for the homepage redesign",
        timestamp: "1 week ago",
      },
    ],
  },
};

const MessengersPage = () => {
  const [messengersList, setMessengersList] = useState<Messenger[]>(messengers);
  const [activeMessenger, setActiveMessenger] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Record<string, Chat>>(mockChats);

  const handleAddMessenger = () => {
    if (!newChatName.trim()) {
      toast.error("Please enter a chat name");
      return;
    }

    const messengerId = `messenger${messengersList.length + 1}`;

    // Create new messenger
    const messenger: Messenger = {
      id: messengerId,
      name: newChatName,
      unread: 0,
    };

    // Create empty chat for the new messenger
    const newChat: Chat = {
      id: messengerId,
      messages: [
        {
          id: "welcome",
          sender: users[0],
          content: `Welcome to ${newChatName}!`,
          timestamp: "Just now",
        },
      ],
    };

    // Update both states
    setMessengersList([...messengersList, messenger]);
    setChats({
      ...chats,
      [messengerId]: newChat,
    });

    setNewChatName("");
    setIsDialogOpen(false);
    toast.success("Chat group created successfully");
  };

  const handleDeleteMessenger = (id: string) => {
    setMessengersList(
      messengersList.filter((messenger) => messenger.id !== id)
    );
    if (activeMessenger === id) {
      setActiveMessenger(null);
    }

    // Remove chat data
    const updatedChats = { ...chats };
    delete updatedChats[id];
    setChats(updatedChats);

    toast.success("Chat deleted");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeMessenger) return;

    // Add message to chat
    if (activeMessenger) {
      const newMsg = {
        id: `msg${Date.now()}`,
        sender: users[0],
        content: newMessage,
        timestamp: "Just now",
      };

      setChats({
        ...chats,
        [activeMessenger]: {
          ...chats[activeMessenger],
          messages: [...(chats[activeMessenger]?.messages || []), newMsg],
        },
      });

      toast.success("Message sent");
      setNewMessage("");
    }
  };

  const filteredMessengers = messengersList.filter((messenger) =>
    messenger.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Messengers</h1>
                <p className="text-muted-foreground">
                  Team communication channels
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Chat</DialogTitle>
                  <DialogDescription>
                    Start a new conversation or create a group
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="chat-name">Chat Name</Label>
                    <Input
                      id="chat-name"
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                      placeholder="Enter chat name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMessenger}>Create Chat</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[calc(100vh-220px)]">
            {/* Messenger List */}
            <div className="lg:col-span-1 bg-card rounded-md overflow-hidden border">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chats..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-auto h-[calc(100%-64px)]">
                <div className="p-0">
                  {filteredMessengers.length > 0 ? (
                    filteredMessengers.map((messenger) => (
                      <div
                        key={messenger.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
                          activeMessenger === messenger.id && "bg-accent"
                        )}
                        onClick={() => setActiveMessenger(messenger.id)}
                      >
                        <Avatar>
                          <AvatarFallback className="uppercase">
                            {messenger.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">
                              {messenger.name}
                            </p>
                            <div className="flex items-center">
                              {messenger.unread > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="mr-2 px-1 min-w-[20px] text-center"
                                >
                                  {messenger.unread}
                                </Badge>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.info(`Editing ${messenger.name}`);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMessenger(messenger.id);
                                    }}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {chats[messenger.id]?.messages.length > 0
                              ? chats[messenger.id].messages[
                                  chats[messenger.id].messages.length - 1
                                ].content.substring(0, 35) + "..."
                              : "No messages yet"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 px-4 text-center text-muted-foreground">
                      <p>No chats found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Create New Chat
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 bg-card rounded-md overflow-hidden border flex flex-col">
              {activeMessenger ? (
                <>
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="uppercase">
                          {messengersList
                            .find((m) => m.id === activeMessenger)
                            ?.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {
                            messengersList.find((m) => m.id === activeMessenger)
                              ?.name
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {chats[activeMessenger]?.messages.length || 0}{" "}
                          messages
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast.info("Add participants functionality")
                      }
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Users
                    </Button>
                  </div>

                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {chats[activeMessenger]?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender.id === users[0].id
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-lg p-3",
                            message.sender.id === users[0].id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.sender.id !== users[0].id && (
                            <p className="font-semibold text-xs mb-1">
                              {message.sender.name}
                            </p>
                          )}
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                  <p className="mb-2">Select a chat to start messaging</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengersPage;
