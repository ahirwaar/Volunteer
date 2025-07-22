import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPinIcon, ClockIcon, UserGroupIcon, ExclamationTriangleIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, UserIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customCity, setCustomCity] = useState('');

  // State to Cities mapping for Indian states (including major cities and ALL districts) - ALPHABETICALLY SORTED
  const stateCitiesMap = {
    "Andhra Pradesh": ["Anantapur", "Bhimavaram", "Chirala", "Chittoor", "East Godavari", "Eluru", "Giddalur", "Guntur", "Hindupur", "Kadapa", "Krishna", "Kurnool", "Machilipatnam", "Madanapalle", "Narasaraopet", "Nellore", "Ongole", "Prakasam", "Rajahmundry", "Srikakulam", "Tirupati", "Vijayawada", "Visakhapatnam", "Vizianagaram", "West Godavari", "Other (Custom)"],
    
    "Arunachal Pradesh": ["Along", "Anini", "Bomdila", "Changlang", "Daporijo", "Hawai", "Itanagar", "Khonsa", "Koloriang", "Longding", "Naharlagun", "Namsai", "Pasighat", "Roing", "Seppa", "Tawang", "Tezu", "Ziro", "Other (Custom)"],
    
    "Assam": ["Bajali", "Baksa", "Barpeta", "Bongaigaon", "Cachar", "Chirang", "Darrang", "Dhubri", "Dima Hasao", "Dibrugarh", "Goalpara", "Golaghat", "Guwahati", "Hailakandi", "Jorhat", "Kamrup Metropolitan", "Kamrup Rural", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Morigaon", "Nagaon", "Nalbari", "Silchar", "Sivasagar", "Sonitpur", "Tinsukia", "Udalguri", "West Karbi Anglong", "Other (Custom)"],
    
    "Bihar": ["Araria", "Arrah", "Aurangabad", "Bagaha", "Banka", "Begusarai", "Bhagalpur", "Bihar Sharif", "Buxar", "Chhapra", "Darbhanga", "Dehri", "East Champaran", "Gaya", "Gopalganj", "Hajipur", "Jamalpur", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Motihari", "Munger", "Muzaffarpur", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sasaram", "Sheikhpura", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", "Other (Custom)"],
    
    "Chhattisgarh": ["Ambikapur", "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bhilai", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Jagdalpur", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja", "Other (Custom)"],
    
    "Goa": ["Bicholim", "Curchorem", "Margao", "Mapusa", "North Goa", "Panaji", "Ponda", "Sanquelim", "South Goa", "Vasco da Gama", "Other (Custom)"],
    
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Deesa", "Devbhoomi Dwarka", "Gandhinagar", "Gandhidham", "Gir Somnath", "Godhra", "Jamnagar", "Jetpur", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Nadiad", "Navsari", "Palanpur", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Vadodara", "Valsad", "Vapi", "Veraval", "Other (Custom)"],
    
    "Haryana": ["Ambala", "Bahadurgarh", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hansi", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kosli", "Kurukshetra", "Mahendragarh", "Mewat", "Narnaul", "Palwal", "Panchkula", "Panipat", "Pundri", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Thanesar", "Yamunanagar", "Other (Custom)"],
    
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Dharamshala", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una", "Other (Custom)"],
    
    "Jharkhand": ["Bokaro", "Chaibasa", "Chatra", "Chirkunda", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamshedpur", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Medininagar", "Pakur", "Phusro", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum", "Other (Custom)"],
    
    "Karnataka": ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Bellary", "Belgaum", "Bhadravati", "Bidar", "Bijapur", "Chikkaballapur", "Chikmagalur", "Chitradurga", "Chamarajanagar", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Gulbarga", "Hassan", "Haveri", "Hospet", "Hubli-Dharwad", "Kodagu", "Kolar", "Koppal", "Mandya", "Mangalore", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir", "Other (Custom)"],
    
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad", "Other (Custom)"],
    
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Murwara", "Narsinghpur", "Neemuch", "Niwari", "Pithampur", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Other (Custom)"],
    
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal", "Other (Custom)"],
    
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul", "Other (Custom)"],
    
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills", "Other (Custom)"],
    
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", "Other (Custom)"],
    
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto", "Other (Custom)"],
    
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Keonjhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh", "Other (Custom)"],
    
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran", "Other (Custom)"],
    
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dhaulpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur", "Other (Custom)"],
    
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim", "Other (Custom)"],
    
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvannamalai", "Tiruvarur", "Thoothukudi", "Trichy", "Vellore", "Villupuram", "Virudhunagar", "Other (Custom)"],
    
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri", "Other (Custom)"],
    
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura", "Other (Custom)"],
    
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi", "Other (Custom)"],
    
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi", "Other (Custom)"],
    
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur", "Other (Custom)"],
    
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman", "Other (Custom)"],
    "Chandigarh": ["Chandigarh", "Other (Custom)"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu", "Other (Custom)"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi", "Other (Custom)"],
    "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur", "Other (Custom)"],
    "Ladakh": ["Kargil", "Leh", "Other (Custom)"],
    "Lakshadweep": ["Lakshadweep", "Other (Custom)"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam", "Other (Custom)"]
  };

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: {
      type: 'in-person',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    schedule: {
      startDate: '',
      timeCommitment: {
        hoursPerWeek: 1,
        duration: 'one-time',
        availabilityRequired: {
          weekdays: false,
          weekends: false,
          evenings: false,
          mornings: false
        }
      }
    },
    skills: [],
    urgency: 'medium',
    status: 'active',
    contactInfo: {
      email: '',
      phone: ''
    },
    volunteersNeeded: 1,
    applicationDeadline: '',
    ageRequirement: {
      minimum: 18,
      maximum: null
    }
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchOpportunityDetails();
      if (user) {
        await checkApplicationStatus();
      }
    };
    init();
  }, [id, user]);

  useEffect(() => {
    // Check if we should open the edit modal based on the URL query parameter
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('edit') === 'true' && opportunity) {
      handleEditClick();
    }
  }, [location.search, opportunity]);

  const fetchOpportunityDetails = async () => {
    try {
      const response = await api.get(`/opportunities/${id}`, { auth: false });
      if (response.data.success) {
        setOpportunity(response.data.data);
        setError('');
      } else {
        setError('Failed to fetch opportunity details');
      }
    } catch (err) {
      console.error('Error fetching opportunity:', err);
      const errorMessage = err.response?.data?.message || 'Error fetching opportunity details';
      setError(errorMessage);
      // If it's an invalid ID format, redirect to opportunities page
      if (errorMessage.includes('Invalid opportunity ID')) {
        toast.error('Invalid opportunity ID format');
        navigate('/opportunities');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/applications/my');
      if (response.data.success) {
        const application = response.data.data.find(
          app => app?.opportunity && app.opportunity._id === id
        );
        if (application) {
          setHasApplied(true);
          setCurrentApplication(application);
          setApplicationMessage(application.applicationMessage || '');
        } else {
          setHasApplied(false);
          setCurrentApplication(null);
          setApplicationMessage('');
        }
      }
    } catch (err) {
      console.error('Error checking application status:', err);
      // Don't show an error toast here as this is a background check
      setHasApplied(false);
      setCurrentApplication(null);
      setApplicationMessage('');
    }
  };

  const handleApply = async () => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', `/opportunities/${id}`);
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      const response = await api.post('/applications', {
        opportunity: id,
        applicationMessage
      });

      if (response.data.success) {
        setHasApplied(true);
        setCurrentApplication(response.data.data);
        toast.success('Application submitted successfully!');
        setIsApplyModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Apply error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!currentApplication) return;

    try {
      setWithdrawing(true);
      const response = await api.put(`/applications/${currentApplication._id}/withdraw`);
      
      if (response.data.success) {
        toast.success('Application withdrawn successfully');
        setHasApplied(false);
        setCurrentApplication(null);
      } else {
        throw new Error(response.data.message || 'Failed to withdraw application');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      title: opportunity.title,
      description: opportunity.description,
      category: opportunity.category,
      location: {
        type: opportunity.location?.type || 'in-person',
        address: {
          city: opportunity.location?.address?.city || '',
          state: opportunity.location?.address?.state || '',
          street: opportunity.location?.address?.street || '',
          zipCode: opportunity.location?.address?.zipCode || ''
        }
      },
      schedule: {
        startDate: opportunity.schedule?.startDate || new Date().toISOString().split('T')[0],
        timeCommitment: {
          hoursPerWeek: opportunity.schedule?.timeCommitment?.hoursPerWeek || 1,
          duration: opportunity.schedule?.timeCommitment?.duration || 'one-time',
          availabilityRequired: {
            weekdays: opportunity.schedule?.timeCommitment?.availabilityRequired?.weekdays || false,
            weekends: opportunity.schedule?.timeCommitment?.availabilityRequired?.weekends || false,
            evenings: opportunity.schedule?.timeCommitment?.availabilityRequired?.evenings || false,
            mornings: opportunity.schedule?.timeCommitment?.availabilityRequired?.mornings || false
          }
        }
      },
      skills: opportunity.skillsRequired || [],
      urgency: opportunity.urgency || 'medium',
      status: opportunity.status || 'active',
      contactInfo: {
        email: opportunity.organization?.email || '',
        phone: opportunity.organization?.phone || ''
      },
      volunteersNeeded: opportunity.volunteersNeeded || 1,
      applicationDeadline: opportunity.applicationDeadline ? new Date(opportunity.applicationDeadline).toISOString().split('T')[0] : '',
      ageRequirement: {
        minimum: opportunity.ageRequirement?.minimum || 18,
        maximum: opportunity.ageRequirement?.maximum || null
      }
    });
    setIsEditing(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditing(true);

    try {
      // Debug: Log the current editFormData to see what we're working with
      console.log('editFormData before processing:', editFormData);

      // Prepare complete data structure that matches the backend model exactly
      const formData = {
        title: editFormData.title || '',
        description: editFormData.description || '',
        category: editFormData.category || '',
        urgency: editFormData.urgency || 'medium',
        status: editFormData.status || 'active',
        volunteersNeeded: parseInt(editFormData.volunteersNeeded) || 1,
        skills: editFormData.skills || [],
        location: {
          type: editFormData.location?.type || 'in-person',
          address: {
            street: editFormData.location?.address?.street || '',
            city: editFormData.location?.address?.city || '',
            state: editFormData.location?.address?.state || '',
            zipCode: editFormData.location?.address?.zipCode || ''
          }
        },
        schedule: {
          startDate: editFormData.schedule?.startDate || new Date().toISOString().split('T')[0],
          timeCommitment: {
            hoursPerWeek: parseInt(editFormData.schedule?.timeCommitment?.hoursPerWeek) || 1,
            duration: editFormData.schedule?.timeCommitment?.duration || 'one-time',
            availabilityRequired: {
              weekdays: Boolean(editFormData.schedule?.timeCommitment?.availabilityRequired?.weekdays),
              weekends: Boolean(editFormData.schedule?.timeCommitment?.availabilityRequired?.weekends),
              evenings: Boolean(editFormData.schedule?.timeCommitment?.availabilityRequired?.evenings),
              mornings: Boolean(editFormData.schedule?.timeCommitment?.availabilityRequired?.mornings)
            }
          }
        },
        contactInfo: {
          email: editFormData.contactInfo?.email || '',
          phone: editFormData.contactInfo?.phone || ''
        },
        ageRequirement: {
          minimum: parseInt(editFormData.ageRequirement?.minimum) || 18,
          maximum: editFormData.ageRequirement?.maximum ? parseInt(editFormData.ageRequirement?.maximum) : null
        }
      };

      // Add optional fields
      if (editFormData.applicationDeadline) {
        formData.applicationDeadline = editFormData.applicationDeadline;
      }

      // Debug: Log the final formData being sent
      console.log('Final formData being sent:', JSON.stringify(formData, null, 2));

      const response = await api.put(`/opportunities/${id}`, formData);
      
      if (response.data.success) {
        toast.success('Opportunity updated successfully!');
        setOpportunity(response.data.data);
        setIsEditing(false);
        // Refresh the opportunity details
        await fetchOpportunityDetails();
      } else {
        throw new Error(response.data.message || 'Failed to update opportunity');
      }
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update opportunity');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(`/opportunities/${id}`);
      if (response.data.success) {
        toast.success('Opportunity deleted successfully!');
        navigate('/organization/dashboard');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete opportunity');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getUrgencyStyle = (urgency) => {
    if (!urgency) return 'text-gray-600 bg-gray-100';
    const styles = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return styles[urgency] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOpportunityAvailable = (opportunity) => {
    if (!opportunity) return false;
    
    const now = new Date();
    const deadline = opportunity.applicationDeadline ? new Date(opportunity.applicationDeadline) : null;
    const totalApplications = (opportunity.applications?.length || 0);
    
    return (
      opportunity.status === 'active' &&
      (!deadline || now < deadline) &&
      totalApplications < (opportunity.volunteersNeeded || 1)
    );
  };

  const getAvailabilityMessage = (opportunity) => {
    if (!opportunity) return '';

    if (opportunity.status !== 'active') {
      return opportunity.status === 'draft' ? 'This opportunity is in draft mode' : 'This opportunity is no longer active';
    }

    const now = new Date();
    const deadline = opportunity.applicationDeadline ? new Date(opportunity.applicationDeadline) : null;
    if (deadline && now > deadline) {
      return 'Application deadline has passed';
    }

    const totalApplications = (opportunity.applications?.length || 0);
    const volunteersNeeded = opportunity.volunteersNeeded || 1;
    if (totalApplications >= volunteersNeeded) {
      return `Maximum limit of ${volunteersNeeded} volunteer${volunteersNeeded > 1 ? 's' : ''} reached`;
    }

    const spotsLeft = volunteersNeeded - totalApplications;
    return `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} remaining`;
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Check if the logged-in user is the organization that posted this opportunity or an admin
  const isOrganizationOwner = user?.role === 'organization' && user?._id === opportunity?.organization?._id;
  const canEditOpportunity = isOrganizationOwner || user?.role === 'admin';

  const renderActionButton = () => {
    if (!user) {
      return (
        <button
          onClick={() => {
            sessionStorage.setItem('redirectAfterLogin', `/opportunities/${id}`);
            navigate('/login');
          }}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login to Apply
        </button>
      );
    }

    if (hasApplied) {
      return (
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsApplyModalOpen(true)}
        disabled={applying}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {applying ? 'Applying...' : 'Apply Now'}
      </button>
    );
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      const response = await api.post('/applications', {
        opportunity: id,
        applicationMessage
      });

      if (response.data.success) {
        setHasApplied(true);
        setIsApplyModalOpen(false);
        toast.success('Application submitted successfully!');
        await checkApplicationStatus();
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Apply error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Opportunity not found</h2>
            <p className="mt-2 text-gray-600">The opportunity you're looking for doesn't exist or has been removed.</p>
            <Link to="/opportunities" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Browse other opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/opportunities"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Opportunities
        </Link>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Availability Banner */}
          <div className={`p-4 ${
            isOpportunityAvailable(opportunity)
              ? 'bg-green-50 border-b border-green-100'
              : 'bg-red-50 border-b border-red-100'
          }`}>
            <div className="flex items-center">
              {isOpportunityAvailable(opportunity) ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              )}
              <div>
                <h3 className={`text-lg font-medium ${
                  isOpportunityAvailable(opportunity) ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isOpportunityAvailable(opportunity) ? 'Available' : 'Unavailable'}
                </h3>
                <p className={`text-sm ${
                  isOpportunityAvailable(opportunity) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getAvailabilityMessage(opportunity)}
                </p>
              </div>
              {isOpportunityAvailable(opportunity) && (
                <div className="ml-auto flex items-center">
                  <UserIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-600 font-medium">
                    {opportunity.volunteersNeeded - (opportunity.applications?.length || 0)} spots left
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Header with Admin Actions */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <div className="flex items-center space-x-2">
                  {opportunity.urgency && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyStyle(opportunity.urgency)}`}>
                      {opportunity.urgency ? opportunity.urgency.charAt(0).toUpperCase() + opportunity.urgency.slice(1) : 'Normal'}
                    </span>
                  )}
                  {opportunity.applicationDeadline && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Deadline: {formatDate(opportunity.applicationDeadline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {canEditOpportunity && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Organization Info with enhanced styling */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {opportunity.organization?.organizationName || opportunity.organization?.name}
                    </h4>
                    <p className="text-sm text-gray-500">Organization Name</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <a 
                      href={`mailto:${opportunity.organization?.email}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {opportunity.organization?.email}
                    </a>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>

                {opportunity.organization?.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                      <a 
                        href={`tel:${opportunity.organization?.phone}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {opportunity.organization?.phone}
                      </a>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                )}

                {opportunity.organization?.organizationProfile?.website && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                      <a 
                        href={opportunity.organization?.organizationProfile?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {opportunity.organization?.organizationProfile?.website}
                      </a>
                      <p className="text-sm text-gray-500">Website</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location with enhanced styling */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-gray-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {opportunity.location?.address?.city}, {opportunity.location?.address?.state}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {opportunity.location?.type !== 'in-person' && `(${opportunity.location?.type})`}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule with enhanced styling */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-gray-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {opportunity.schedule?.isRecurring ? 'Recurring Opportunity' : 'One-time Opportunity'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {opportunity.schedule?.recurringPattern?.frequency
                      ? `${opportunity.schedule.recurringPattern.frequency} on ${opportunity.schedule.recurringPattern.daysOfWeek?.join(', ')}`
                      : formatDate(opportunity.schedule?.startDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{opportunity.description}</p>
            </div>

            {/* Apply Button Section */}
            {!isOrganizationOwner && (
              <div className="mt-8 border-t pt-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {hasApplied ? 'You have applied for this opportunity' : 'Interested in volunteering?'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {hasApplied 
                        ? `Application status: ${currentApplication?.status}`
                        : 'Click the button to submit your application'}
                    </p>
                  </div>
                  {isOpportunityAvailable(opportunity) ? (
                    hasApplied ? (
                      <button
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {applying ? 'Applying...' : 'Apply Now'}
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {opportunity.requirements.minAge && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      Minimum age: {opportunity.requirements.minAge} years
                    </li>
                  )}
                  {opportunity.requirements.backgroundCheck && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      Background check required
                    </li>
                  )}
                  {opportunity.requirements.training?.required && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      Training required: {opportunity.requirements.training.description}
                    </li>
                  )}
                  {opportunity.requirements.physicalRequirements && (
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      Physical requirements: {opportunity.requirements.physicalRequirements}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Skills Required */}
            {opportunity.skillsRequired?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentApplication && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-500">Application Status:</span>
                <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                  currentApplication.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : currentApplication.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : currentApplication.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentApplication.status.charAt(0).toUpperCase() + currentApplication.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
                <span className="text-sm text-gray-500">
                  Applied on {new Date(currentApplication.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {currentApplication.applicationMessage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Your message: {currentApplication.applicationMessage}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Opportunity</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                      <select
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="elderly-care">Elderly Care</option>
                        <option value="medical-support">Medical Support</option>
                        <option value="companionship">Companionship</option>
                        <option value="technology-assistance">Technology Assistance</option>
                        <option value="transportation">Transportation</option>
                        <option value="grocery-shopping">Grocery Shopping</option>
                        <option value="household-help">Household Help</option>
                        <option value="administrative-help">Administrative Help</option>
                        <option value="emergency-response">Emergency Response</option>
                        <option value="education">Education</option>
                        <option value="environment">Environment</option>
                        <option value="community">Community</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Urgency <span className="text-red-500">*</span></label>
                      <select
                        value={editFormData.urgency}
                        onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Volunteers Needed <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        value={editFormData.volunteersNeeded}
                        onChange={(e) => setEditFormData({ ...editFormData, volunteersNeeded: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
                                          <input
                        type="text"
                        value={editFormData.skills.join(', ')}
                        onChange={(e) => setEditFormData({ 
                          ...editFormData, 
                          skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                        })}
                        placeholder="e.g., Communication, Patience, First Aid"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Location</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Type <span className="text-red-500">*</span></label>
                    <select
                      value={editFormData.location?.type || 'in-person'}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        location: { 
                          ...editFormData.location,
                          type: e.target.value,
                          address: editFormData.location?.address || { street: '', city: '', state: '', zipCode: '' }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      required
                    >
                      <option value="in-person">In Person</option>
                      <option value="virtual">Virtual</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  {editFormData.location?.type !== 'virtual' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          type="text"
                          value={editFormData.location?.address?.street || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            location: {
                              ...editFormData.location,
                              address: {
                                ...(editFormData.location?.address || {}),
                                street: e.target.value
                              }
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                        <select
                          value={editFormData.location?.address?.city === customCity ? 'Other (Custom)' : editFormData.location?.address?.city || ''}
                          onChange={(e) => {
                            if (e.target.value === 'Other (Custom)') {
                              setCustomCity(editFormData.location?.address?.city || '');
                            } else {
                              setCustomCity('');
                              setEditFormData({
                                ...editFormData,
                                location: {
                                  ...editFormData.location,
                                  address: {
                                    ...(editFormData.location?.address || {}),
                                    city: e.target.value
                                  }
                                }
                              });
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          required={editFormData.location?.type !== 'remote'}
                          disabled={!editFormData.location?.address?.state}
                        >
                          <option value="">
                            {editFormData.location?.address?.state ? 'Select City' : 'First select a state'}
                          </option>
                          {stateCitiesMap[editFormData.location?.address?.state]?.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                          ))}
                        </select>
                        
                        {/* Custom City Input */}
                        {(editFormData.location?.address?.city === 'Other (Custom)' || customCity) && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700">Enter Custom City</label>
                            <input
                              type="text"
                              value={customCity || (editFormData.location?.address?.city !== 'Other (Custom)' ? editFormData.location?.address?.city || '' : '')}
                              onChange={(e) => {
                                setCustomCity(e.target.value);
                                setEditFormData({
                                  ...editFormData,
                                  location: {
                                    ...editFormData.location,
                                    address: {
                                      ...(editFormData.location?.address || {}),
                                      city: e.target.value
                                    }
                                  }
                                });
                              }}
                              placeholder="Enter your city name"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                              required={editFormData.location?.type !== 'remote'}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
                        <select
                          value={editFormData.location?.address?.state || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            location: {
                              ...editFormData.location,
                              address: {
                                ...(editFormData.location?.address || {}),
                                state: e.target.value,
                                city: '' // Clear city when state changes
                              }
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                          required={editFormData.location?.type !== 'remote'}
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                          <optgroup label="Union Territories">
                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Puducherry">Puducherry</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                          type="text"
                          value={editFormData.location?.address?.zipCode || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            location: {
                              ...editFormData.location,
                              address: {
                                ...(editFormData.location?.address || {}),
                                zipCode: e.target.value
                              }
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Schedule</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={editFormData.schedule?.startDate || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          schedule: {
                            ...editFormData.schedule,
                            startDate: e.target.value
                          }
                        })}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Deadline (Optional)</label>
                      <input
                        type="date"
                        value={editFormData.applicationDeadline || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, applicationDeadline: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        max={editFormData.schedule?.startDate || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>

                    <div>
                                              <label className="block text-sm font-medium text-gray-700">Hours Per Week</label>
                        <input
                          type="number"
                          min="1"
                          value={editFormData.schedule?.timeCommitment?.hoursPerWeek || 1}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            schedule: {
                              ...editFormData.schedule,
                              timeCommitment: {
                                ...editFormData.schedule?.timeCommitment,
                                hoursPerWeek: e.target.value
                              }
                            }
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <select
                        value={editFormData.schedule?.timeCommitment?.duration || 'one-time'}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          schedule: {
                            ...editFormData.schedule,
                            timeCommitment: {
                              ...editFormData.schedule?.timeCommitment,
                              duration: e.target.value
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      >
                        <option value="one-time">One-time</option>
                        <option value="short-term">Short-term</option>
                        <option value="long-term">Long-term</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Availability Required</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['weekdays', 'weekends', 'mornings', 'evenings'].map((time) => (
                        <label key={time} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editFormData.schedule?.timeCommitment?.availabilityRequired?.[time] || false}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              schedule: {
                                ...editFormData.schedule,
                                timeCommitment: {
                                  ...editFormData.schedule?.timeCommitment,
                                  availabilityRequired: {
                                    ...editFormData.schedule?.timeCommitment?.availabilityRequired,
                                    [time]: e.target.checked
                                  }
                                }
                              }
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={editFormData.contactInfo?.email || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          contactInfo: {
                            ...editFormData.contactInfo,
                            email: e.target.value
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="tel"
                        value={editFormData.contactInfo?.phone || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          contactInfo: {
                            ...editFormData.contactInfo,
                            phone: e.target.value
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Requirements */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Age Requirements</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Age</label>
                      <input
                        type="number"
                        min="0"
                        value={editFormData.ageRequirement?.minimum || 18}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          ageRequirement: {
                            ...editFormData.ageRequirement,
                            minimum: e.target.value
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maximum Age (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        value={editFormData.ageRequirement?.maximum || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          ageRequirement: {
                            ...editFormData.ageRequirement,
                            maximum: e.target.value || null
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editing}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {editing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Opportunity</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this opportunity? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Application Modal */}
        {isViewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Volunteer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Volunteer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-gray-900">{selectedApplication.volunteer.name}</p>
                        <p className="text-sm text-gray-500">Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <a 
                          href={`mailto:${selectedApplication.volunteer.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedApplication.volunteer.email}
                        </a>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>

                    {selectedApplication.volunteer.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <a 
                            href={`tel:${selectedApplication.volunteer.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedApplication.volunteer.phone}
                          </a>
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Message */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {selectedApplication.message || "No message provided"}
                  </p>
                </div>

                {/* Application Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                      selectedApplication.status
                    )}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>

                {/* Application Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                  <p className="text-gray-900">
                    {new Date(selectedApplication.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Application Action Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Ready to Help?</h3>
              <p className="text-gray-600">
                Join this meaningful opportunity and make a difference in your community.
              </p>
              {renderActionButton()}
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for {opportunity?.title}</h3>
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you interested in this opportunity? (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share why you'd be a great fit for this role..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetails; 