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
    const canvas = await html2canvas(element, { scale: 2 });
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Action Buttons outside the white section */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleDownloadPDF}>Download PDF</Button>
      </div>

      {/* Printable Section */}
      <div
        ref={printRef}
        className="bg-white p-6 shadow-none border print:border-none print:m-0 print:w-[210mm] print:h-[297mm] print:p-6"
      >
        <Card className="shadow-none border-none">
          <CardContent className="p-0">
            {/* Company Heading */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold italic">Shringi Food Services</h1>
              <p className="text-sm italic">Impressive Selection For Any Occasion</p>
            </div>

            {/* Booking Info styled as table */}
            <div className="border border-black mb-6">
              <div className="grid grid-cols-12 border-b border-black">
                <div className="col-span-3 border-r border-black px-2 py-1 text-sm font-semibold">Name Of Customer :-</div>
                <div className="col-span-5 border-r border-black px-2 py-1 text-sm">{customerName?.en}</div>
                <div className="col-span-2 border-r border-black px-2 py-1 text-sm font-semibold">M.N. :-</div>
                <div className="col-span-2 px-2 py-1 text-sm">{mobileNumber}{alternateContact?.number ? `, ${alternateContact?.number}` : ""}</div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-3 border-r border-black px-2 py-1 text-sm font-semibold">Venue :-</div>
                <div className="col-span-9 px-2 py-1 text-sm">{venueAddress}</div>
              </div>
            </div>

            {/* Menu Section */}
            <h2 className="text-center font-bold text-lg mb-4">Menu:</h2>

            {occasions?.map((occasion, occIdx) => (
              <div
                key={occasion._id}
                className="border border-black mb-6 break-before-page"
              >
                <div className="border-b border-black text-center font-semibold py-1">
                  {new Date(occasion.date).toLocaleDateString()}
                </div>

                {occasion.events?.map((event) => (
                  <div key={event._id} className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-3 border-r border-black px-2 py-1 text-sm font-semibold">
                      {event.eventTypeId?.name?.en} {event.noOfGuests} Guests {event.startTime && ` ${event.startTime}`}
                    </div>
                    <div className="col-span-9 px-2 py-1 text-sm">
                      {event.menu?.map((item, idx) => (
                        <span key={item._id}>
                          {item.dishId?.name?.en}
                          {idx < event.menu.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Footer */}
            <div className="border-t pt-4 mt-8 text-center text-sm">
              <p className="font-semibold">Shringi Food Services</p>
              <p>Bundi (Raj.) | Contact: 94143-94181, 96944-87748, 98282-89454</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}