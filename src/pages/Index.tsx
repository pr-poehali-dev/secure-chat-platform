import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Auth from './Auth';

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
  isRead?: boolean;
  replyTo?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUser(username);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  if (!isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  const chats: Chat[] = [
    { id: 1, name: 'Анна Петрова', avatar: '👩‍💼', lastMessage: 'Отлично, встретимся завтра!', time: '14:32', unread: 2, online: true },
    { id: 2, name: 'Дизайн-команда', avatar: '🎨', lastMessage: 'Макеты готовы к ревью', time: '13:15', unread: 5 },
    { id: 3, name: 'Максим Волков', avatar: '👨‍💻', lastMessage: 'Код отправил на проверку', time: '12:45', online: true },
    { id: 4, name: 'Маркетинг', avatar: '📊', lastMessage: 'Статистика за неделю внутри', time: '11:20' },
    { id: 5, name: 'София Иванова', avatar: '👩‍🎨', lastMessage: 'Спасибо за фидбек! 🙏', time: 'Вчера' },
  ];

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела с новым проектом?', time: '14:20', isMine: false },
    { id: 2, text: 'Отлично! Уже закончил дизайн', time: '14:22', isMine: true, isRead: true },
    { id: 3, text: 'Можешь показать результат?', time: '14:25', isMine: false },
    { id: 4, text: 'Конечно, отправлю через минуту', time: '14:26', isMine: true, isRead: true },
    { id: 5, text: 'Когда встретимся обсудить детали?', time: '14:30', isMine: false },
    { id: 6, text: 'Отлично, встретимся завтра!', time: '14:32', isMine: true, isRead: false, replyTo: 'Когда встретимся обсудить детали?' },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-muted"
            >
              <Icon name="Menu" size={24} />
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Icon name="Search" size={20} />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/5">
                    <Icon name="User" size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-effect border-l border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Профиль</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                        <AvatarFallback className="text-3xl gradient-primary">
                          👤
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">{currentUser}</h3>
                        <p className="text-sm text-muted-foreground">@{currentUser.toLowerCase().replace(/\s+/g, '')}</p>
                      </div>
                      <Badge className="gradient-primary border-0">
                        <Icon name="Check" size={12} className="mr-1" />
                        Онлайн
                      </Badge>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Статус</Label>
                        <Input 
                          placeholder="Ваш статус..." 
                          className="glass-effect border-white/10"
                          defaultValue="Доступен для общения"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block">О себе</Label>
                        <Input 
                          placeholder="Расскажите о себе..." 
                          className="glass-effect border-white/10"
                          defaultValue="Люблю создавать классные штуки"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <h4 className="font-semibold">Приватность</h4>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="online-status" className="text-sm">Показывать статус онлайн</Label>
                        <Switch id="online-status" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="read-receipts" className="text-sm">Отметки о прочтении</Label>
                        <Switch id="read-receipts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="typing-indicator" className="text-sm">Индикатор набора</Label>
                        <Switch id="typing-indicator" defaultChecked />
                      </div>
                    </div>

                    <Button className="w-full gradient-primary border-0 hover:opacity-90 transition-opacity">
                      Сохранить изменения
                    </Button>

                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Icon name="LogOut" size={18} className="mr-2" />
                      Выйти из аккаунта
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-0">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-3 flex items-center gap-3 transition-all hover:bg-muted border-b border-border ${
                  selectedChat === chat.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-xl">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-card"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-sm truncate flex-1">{chat.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">{chat.lastMessage}</p>
                    {chat.unread && (
                      <Badge className="bg-primary text-primary-foreground border-0 h-5 min-w-5 px-1.5 flex items-center justify-center text-xs rounded-full flex-shrink-0">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border glass-effect flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-white/10">
              <AvatarFallback className="text-lg">👩‍💼</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Анна Петрова</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                онлайн
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-md ${message.isMine ? 'order-2' : ''}`}>
                  {message.replyTo && (
                    <div className="mb-1 px-3 py-2 rounded-t-lg bg-white/5 border-l-2 border-primary text-xs text-muted-foreground">
                      {message.replyTo}
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 ${
                      message.isMine
                        ? 'gradient-primary rounded-2xl rounded-br-md'
                        : 'glass-effect rounded-2xl rounded-bl-md'
                    } group relative`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-70">{message.time}</span>
                      {message.isMine && (
                        <Icon 
                          name={message.isRead ? "CheckCheck" : "Check"} 
                          size={14} 
                          className={message.isRead ? "text-primary" : "opacity-70"}
                        />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => setReplyingTo(message)}
                    >
                      <Icon name="Reply" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border glass-effect">
          {replyingTo && (
            <div className="mb-2 px-3 py-2 glass-effect rounded-lg flex items-center justify-between border-l-2 border-primary">
              <div>
                <p className="text-xs text-primary font-medium">Ответ на сообщение</p>
                <p className="text-sm text-muted-foreground truncate">{replyingTo.text}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setReplyingTo(null)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <Button variant="ghost" size="icon" className="hover:bg-white/5 flex-shrink-0">
              <Icon name="Paperclip" size={20} />
            </Button>
            <div className="flex-1 glass-effect rounded-2xl border border-white/10 flex items-end">
              <Input
                placeholder="Написать сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button variant="ghost" size="icon" className="hover:bg-transparent flex-shrink-0">
                <Icon name="Smile" size={20} />
              </Button>
            </div>
            <Button 
              size="icon" 
              className="gradient-primary border-0 hover:opacity-90 transition-opacity flex-shrink-0 h-10 w-10"
              onClick={handleSendMessage}
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;