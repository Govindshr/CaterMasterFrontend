import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  EyeOff,
  X,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { config } from "@/services/nodeconfig";
import { protectedGetApi, protectedPostApi, postApi } from "@/services/nodeapi";
import { toast } from 'react-toastify';

// Dummy data for testing
const dummyUsers = [
  {
    id: 1,
    fullName: "John Doe",
    mobile: "9876543210",
    email: "john.doe@example.com",
    userType: "super admin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    fullName: "Jane Smith",
    mobile: "9876543211",
    email: "jane.smith@example.com",
    userType: "admin",
    status: "active",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: 3,
    fullName: "Bob Johnson",
    mobile: "9876543212",
    email: "bob.johnson@example.com",
    userType: "user",
    status: "active",
    createdAt: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    fullName: "Alice Brown",
    mobile: "9876543213",
    email: "alice.brown@example.com",
    userType: "user",
    status: "inactive",
    createdAt: "2024-01-18T16:45:00Z"
  },
  {
    id: 5,
    fullName: "Charlie Wilson",
    mobile: "9876543214",
    email: "charlie.wilson@example.com",
    userType: "user",
    status: "active",
    createdAt: "2024-01-19T11:30:00Z"
  }
];

export default function UserManagement() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState(dummyUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Add User Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await protectedGetApi(config.GetAllUsers, token);
      if (res.success === true) {
        console.log(res.users);
        setUsers(res.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to dummy data if API fails
      setUsers(dummyUsers);
      toast.error("Failed to fetch users. Using demo data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await protectedPostApi(config.DeleteUser, { userId }, token);
      
      if (response.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(`${config.GetUserDetails}/${userId}`, token);
      
      if (response.success) {
        setSelectedUser(response.user);
        setIsModalOpen(true);
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Fallback to dummy user data
      const user = users.find(u => u.id === userId);
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  // Add User Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') validatePasswordStrength(value);
    if (name === 'confirmPassword') validatePasswordMatch(formData.password, value);
    if (name === 'mobile') validateMobile(value);
  };

  const validatePasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    setPasswordError(
      strongRegex.test(password)
        ? ''
        : 'Must be 8+ chars with upper, lower, number & special char.'
    );
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    setMatchError(password === confirmPassword ? '' : 'Passwords do not match.');
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    setMobileError(mobileRegex.test(mobile) ? '' : 'Enter valid 10-digit mobile number.');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (passwordError || matchError || mobileError) return;

    setIsSubmitting(true);
    const payload = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      password: formData.password,
      userType: formData.userType,
      status: 'active',
    };

    try {
      const res = await postApi(config.RegisterUser, payload);
      toast.success('User created successfully!');
      
      // Add the new user to the list
      const newUser = {
        id: res.data?.id || Date.now(), // Fallback ID if API doesn't return one
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: res.data?.email || '',
        userType: formData.userType,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setUsers([newUser, ...users]);
      setIsAddUserModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      userType: 'user',
    });
    setShowPassword(false);
    setPasswordError('');
    setMatchError('');
    setMobileError('');
  };

const filteredUsers = users.filter((user) => {
  const nameEn = typeof user.fullName === "object" ? user.fullName.en : user.fullName;
  return (
    nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.mobile?.includes(searchQuery) ||
    user.userType?.toLowerCase().includes(searchQuery.toLowerCase())
  );
});


  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "super admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mobile User Card Component
  const UserCard = ({ user }) => (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 break-words whitespace-normal max-w-full text-base leading-tight">
              {user.fullName?.length > 22 ? (
               <span title={user.fullName?.en}>
    {user.fullName?.en.length > 22
      ? user.fullName.en.slice(0, 22) + "..."
      : user.fullName.en}
  </span>
              ) : (
                 user.fullName?.en
              )}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
              ID: {user.id}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 dark:text-gray-100 truncate">
              {user.email || "No email"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 dark:text-gray-100">
              {user.mobile}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
            <Shield className="w-3 h-3 mr-1" />
            {user.userType}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
        </div>

        {/* Action Buttons: Centered below info */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            onClick={() => handleViewUser(user.id)}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 rounded-full flex items-center justify-center"
            aria-label="View User"
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => handleDeleteUser(user.id)}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 rounded-full flex items-center justify-center"
            aria-label="Delete User"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  User Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and monitor all system users
                </p>
              </div>
              <Button
                onClick={() => setIsAddUserModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="hidden sm:inline">Add New User</span>
                <span className="sm:hidden">Add User</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading users...
                </div>
              </div>
            )}

            {/* No Users Found */}
            {!isLoading && filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No users found
              </div>
            )}

            {/* Desktop Table View */}
            {!isLoading && filteredUsers.length > 0 && !isMobile && (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">User</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Contact</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Role</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Created</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(startIndex, startIndex + itemsPerPage).map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {typeof user.fullName === "object" ? user.fullName.en : user.fullName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-gray-100">{user.mobile}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.userType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleViewUser(user.id)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Mobile Card View */}
            {!isLoading && filteredUsers.length > 0 && isMobile && (
              <div className="space-y-4">
                {filteredUsers.slice(startIndex, startIndex + itemsPerPage).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="mx-1"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 sm:space-y-6 mt-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      User ID: {selectedUser.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedUser.fullName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mobile Number
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedUser.mobile}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedUser.email || "Not provided"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      User Type
                    </Label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(selectedUser.userType)}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {selectedUser.userType}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </Label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Created At
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add User Modal */}
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Add New User
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  placeholder="Enter mobile number"
                  className="w-full"
                  required
                />
                {mobileError && <p className="text-sm text-red-500">{mobileError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Enter password"
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  className="w-full"
                  required
                />
                {matchError && <p className="text-sm text-red-500">{matchError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  User Type
                </Label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddUserModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!passwordError || !!matchError || !!mobileError}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 