import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { protectedGetApi } from "@/services/nodeapi";
import { config } from "@/services/nodeconfig";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrintMenu() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await protectedGetApi(
        `${config.AddBooking}/${id}/occasions-with-events`,
        token
      );
      if (response.success && response.data) {
        setBookingData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch booking occasions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

    // Handle content longer than one page
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
      let y = -pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        pdf.addPage();
        y = y + pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, y, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
    }

    pdf.save("menu.pdf");
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (!bookingData) return <p className="p-4 text-center">No data found</p>;

  const { customerName, mobileNumber, venueAddress, alternateContact, occasions } = bookingData;

  // Filter out occasions that don't have events or menus
  const validOccasions = occasions?.filter(occasion => 
    occasion.events && occasion.events.length > 0 && 
    occasion.events.some(event => event.menu && event.menu.length > 0)
  );

  return (
    <div className="p-2 max-w-4xl mx-auto">
      {/* Action Buttons outside the white section */}
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">Download PDF</Button>
      </div>

      {/* Printable Section - Single Bordered Card */}
      <div
        ref={printRef}
        className="bg-white border border-black p-2 shadow-none print:border-black print:m-0 print:w-[210mm] print:h-[297mm] print:p-2"
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        {/* Company Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold mb-0.5">Shringi Food Services</h1>
          <p className="text-xs italic mb-0.5">A Complete Food Solution</p>
          <p className="text-xs italic">Impressive Selection For Any Occasion</p>
        </div>

        {/* Customer Details Table - Compact with Equal Columns */}
        <div className="mb-2">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-black px-1 py-0.5 text-xs font-bold w-1/4" style={{ borderWidth: '1px' }}>Name Of Customer :-</td>
                <td className="border border-black px-1 py-0.5 text-xs w-1/4" style={{ borderWidth: '1px' }}>{customerName?.en}</td>
                <td className="border border-black px-1 py-0.5 text-xs font-bold w-1/4" style={{ borderWidth: '1px' }}>M.N. :-</td>
                <td className="border border-black px-1 py-0.5 text-xs w-1/4" style={{ borderWidth: '1px' }}>{mobileNumber}{alternateContact?.number ? `, ${alternateContact?.number}` : ""}</td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5 text-xs font-bold" style={{ borderWidth: '1px' }}>Venue :-</td>
                <td className="border border-black px-1 py-0.5 text-xs" colSpan="3" style={{ borderWidth: '1px' }}>{venueAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Menu Section Header */}
        <div className="text-center mb-1">
          <h2 className="text-xs font-bold">Menu:</h2>
        </div>

        {/* Menu Content - Compact Tables */}
        {validOccasions?.map((occasion, occIdx) => (
          <div key={occasion._id} className="mb-1">
            {/* Date Header with Horizontal Rules */}
            <div className="text-center mb-1">
              <hr className="border-black mb-0.5" style={{ borderWidth: '1px', height: '1px' }} />
              <div className="font-bold text-xs">{new Date(occasion.date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}</div>
              <hr className="border-black mt-0.5" style={{ borderWidth: '1px', height: '1px' }} />
            </div>
            
            {/* Menu Items Table - Tight Spacing */}
            <table className="w-full border-collapse">
              <tbody>
                {occasion.events?.filter(event => event.menu && event.menu.length > 0).map((event, eventIdx) => (
                  <tr key={event._id}>
                    <td className="border border-black px-1 py-0.5 text-xs font-bold w-1/3" style={{ borderWidth: '1px' }}>
                      {event.eventTypeId?.name?.en} {event.noOfGuests} आदमी {event.startTime && `${event.startTime} बजे`}
                    </td>
                    <td className="border border-black px-1 py-0.5 text-xs w-2/3" style={{ borderWidth: '1px' }}>
                      :- {event.menu?.map((item, idx) => (
                        <span key={item._id}>
                          {item.dishId?.name?.en}
                          {idx < event.menu.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Footer - Compact Contact Info */}
        <div className="mt-2 text-center">
          <div className="flex justify-between mb-1">
            <div className="text-center">
              <p className="font-bold text-xs">Om Prakash Shringi</p>
              <p className="text-xs">94143-94181</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xs">Chandra Shekhar Shringi</p>
              <p className="text-xs">96944-87748</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xs">Naval Shringi</p>
              <p className="text-xs">98282-89454</p>
            </div>
          </div>
          <p className="font-bold text-xs">Batak Bheru Para, Nahar Ka Chottha Bundi(Raj.)</p>
        </div>
      </div>
    </div>
  );
}