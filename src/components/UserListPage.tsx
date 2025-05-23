import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Mail, Phone, Globe, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    city: string;
  };
}

interface UserListPageProps {
  onLogout: () => void;
}

const UserListPage = ({ onLogout }: UserListPageProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const USERS_PER_PAGE = 10;

  const fetchUsers = useCallback(async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    try {
      // Simulate network delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?_page=${pageNum}&_limit=${USERS_PER_PAGE}`
      );
      const newUsers: User[] = await response.json();

      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        setUsers(prev => pageNum === 1 ? newUsers : [...prev, ...newUsers]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      hasMore &&
      !loading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  }, [hasMore, loading, page, fetchUsers]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const LoadingSkeleton = () => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Directory</h1>
                <p className="text-sm text-gray-500">Manage your team members</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <p className="text-gray-600 mt-1">
                {users.length} {users.length === 1 ? 'member' : 'members'} loaded
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {hasMore ? 'Loading more...' : 'All loaded'}
            </Badge>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-100">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <Badge variant="outline" className="ml-2">
                        @{user.username}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>{user.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="truncate">{user.website}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {user.company.name}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600">
                        {user.address.city}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          )}

          {/* End Message */}
          {!hasMore && users.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 font-medium">You've seen all team members!</p>
              <p className="text-sm text-gray-500 mt-1">
                Total: {users.length} members loaded
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserListPage;