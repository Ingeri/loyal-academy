"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck, Download, Eye, X, Calendar } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateGridProps {
  certificates: any[];
  userName: string;
}

export default function CertificateGrid({
  certificates,
  userName,
}: CertificateGridProps) {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedCert) {
        setSelectedCert(null);
      }
    };

    if (selectedCert) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedCert]);

  // Handle click outside to close
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setSelectedCert(null);
    }
  };

  const downloadPDF = async (certificate: any) => {
    if (!selectedCert) return;

    setIsDownloading(true);
    try {
      // Create PDF directly with jsPDF - no html2canvas needed
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape A4
      const pageWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm

      // Set background gradient (simulated with rectangles)
      pdf.setFillColor(254, 243, 199); // #fef3c7
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Add decorative borders
      pdf.setDrawColor(245, 158, 11, 0.5); // amber-300 with opacity
      pdf.setLineWidth(0.5);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      pdf.setDrawColor(245, 158, 11, 0.3);
      pdf.setLineWidth(0.3);
      pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Set font and colors
      pdf.setTextColor(146, 64, 14); // #92400e

      // Header - Logo area (simulated with circle)
      pdf.setFillColor(217, 119, 6); // #d97706
      pdf.circle(50, 35, 8, "F"); // Logo circle

      // Academy name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("LOYAL ACADEMY", 65, 32);

      // Decorative line
      pdf.setFillColor(245, 158, 11); // #f59e0b
      pdf.rect(65, 38, 60, 2, "F");

      // Main title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 65, {
        align: "center",
      });

      // Awarded to text
      pdf.setFont("times", "italic");
      pdf.setFontSize(14);
      pdf.text("This Certificate is Proudly Awarded To", pageWidth / 2, 90, {
        align: "center",
      });

      // Student name (large and prominent)
      pdf.setFont("times", "bold");
      pdf.setFontSize(36);
      pdf.text(userName, pageWidth / 2, 110, { align: "center" });

      // Underline for name
      pdf.setFillColor(245, 158, 11);
      pdf.rect(pageWidth / 2 - 40, 115, 80, 1, "F");

      // Completion text
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      const completionText =
        "For successfully completing the rigorous curriculum and demonstrating mastery in:";
      const splitCompletion = pdf.splitTextToSize(completionText, 180);
      pdf.text(splitCompletion, pageWidth / 2, 135, { align: "center" });

      // Course name
      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.text(certificate.course.title.toUpperCase(), pageWidth / 2, 155, {
        align: "center",
      });

      // Achievement details
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("GRADE", pageWidth / 2 - 40, 175, { align: "center" });
      pdf.text("FINAL SCORE", pageWidth / 2 + 40, 175, { align: "center" });

      pdf.setFontSize(20);
      pdf.text(certificate.grade || "A+", pageWidth / 2 - 40, 185, {
        align: "center",
      });
      pdf.text(
        `${certificate.finalScore?.toFixed(1) || "95.0"}%`,
        pageWidth / 2 + 40,
        185,
        { align: "center" },
      );

      // Footer details - Left side
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text(
        `Certificate No: ${certificate.certificateNumber}`,
        20,
        pageHeight - 25,
      );
      pdf.text(
        `Issued: ${new Date(certificate.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
        20,
        pageHeight - 20,
      );
      pdf.text(`Grade: ${certificate.grade || "A+"}`, 20, pageHeight - 15);
      pdf.text(
        `Final Score: ${certificate.finalScore?.toFixed(1) || "95.0"}%`,
        20,
        pageHeight - 10,
      );

      // Gold seal - Center
      pdf.setFillColor(202, 138, 4); // #ca8a04
      pdf.circle(pageWidth / 2, pageHeight - 25, 12, "F");

      // Seal border
      pdf.setDrawColor(253, 224, 71); // #fde047
      pdf.setLineWidth(1);
      pdf.circle(pageWidth / 2, pageHeight - 25, 12);

      // Seal inner border
      pdf.setDrawColor(253, 224, 71, 0.5);
      pdf.circle(pageWidth / 2, pageHeight - 25, 11);

      // Seal text
      pdf.setTextColor(146, 64, 14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("LA", pageWidth / 2, pageHeight - 27, { align: "center" });

      pdf.setFontSize(6);
      pdf.text("OFFICIAL", pageWidth / 2, pageHeight - 23, { align: "center" });
      pdf.text("CERTIFIED", pageWidth / 2, pageHeight - 20, {
        align: "center",
      });

      // Signature - Right side
      pdf.setFont("times", "italic");
      pdf.setFontSize(12);
      pdf.text("Director", pageWidth - 40, pageHeight - 30, {
        align: "center",
      });

      // Signature line
      pdf.setFillColor(245, 158, 11);
      pdf.rect(pageWidth - 40 - 20, pageHeight - 25, 40, 1, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("LOYAL ACADEMY", pageWidth - 40, pageHeight - 15, {
        align: "center",
      });

      // Save the PDF
      pdf.save(
        `LoyalAcademy_Certificate_${certificate.certificateNumber}_${certificate.course.title.replace(/\s+/g, "_")}.pdf`,
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="group cursor-pointer"
            onClick={() => setSelectedCert(cert)}
          >
            <Card className="overflow-hidden border-muted/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-950/20 backdrop-blur-sm border-2 border-amber-200/60 dark:border-amber-900/30">
              {/* Certificate Preview - Elegant Design */}
              <div className="aspect-[1.4/1] relative bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-8 overflow-hidden">
                {/* Decorative border frames */}
                <div className="absolute inset-3 border-2 border-amber-300/40 rounded-lg" />
                <div className="absolute inset-5 border-[1px] border-amber-200/60 rounded-sm" />

                <div className="relative z-10 text-center space-y-3 w-full">
                  {/* Certificate Icon */}
                  <div className="w-14 h-14 bg-white rounded-full shadow-md mx-auto flex items-center justify-center border-2 border-amber-300/60">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>

                  {/* Certificate Label */}
                  <p className="text-xs text-amber-700 font-serif uppercase tracking-widest font-bold">
                    Certificate of Completion
                  </p>

                  {/* Course Title */}
                  <h3 className="text-sm font-bold text-amber-950 line-clamp-2 px-2 font-serif leading-tight">
                    {cert.course.title}
                  </h3>

                  {/* Details Preview */}
                  <div className="flex justify-center gap-4 text-[9px] text-amber-700 pt-2 border-t border-amber-200/40">
                    <div>
                      <p className="uppercase tracking-widest font-bold text-amber-800 text-[10px]">
                        {cert.grade || "A"}
                      </p>
                    </div>
                    <div className="text-amber-600">•</div>
                    <div>
                      <p className="uppercase tracking-widest font-bold text-amber-800 text-[10px]">
                        {new Date(cert.issueDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-20 rounded-lg">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 font-bold shadow-lg"
                  >
                    <Eye className="h-4 w-4" /> View Certificate
                  </Button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-t border-amber-100/50 dark:border-amber-900/30">
                <div className="space-y-1 flex-1">
                  <p className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    Grade: {cert.grade || "A+"}
                  </p>
                  <p className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    Score: {cert.finalScore?.toFixed(1) || "95.0"}%
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold tracking-tighter">
                    <Calendar className="h-3 w-3" />
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] text-amber-700 dark:text-amber-300 uppercase font-bold tracking-widest">
                    #{cert.certificateNumber}
                  </p>
                  <ShieldCheck className="text-amber-600 dark:text-amber-400 h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* ACADEMIC CERTIFICATE MODAL */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex max-h-[99vh] justify-center overflow-y-auto bg-slate-950/90 backdrop-blur-md px-4 py-8"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-5xl max-h-[85vh] space-y-4 overflow-y-auto animate-in zoom-in-95 duration-300"
          >
            <div className="flex justify-between items-center text-white px-2">
              <h2 className="text-lg font-serif italic">Credential Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-black border-white/20 hover:bg-white/80"
                  onClick={() => downloadPDF(selectedCert)}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Generating..." : "Save PDF"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-black bg-white hover:bg-white/80 rounded"
                  onClick={() => setSelectedCert(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* THE ELEGANT CERTIFICATE TEMPLATE */}
            <div
              ref={certRef}
              className="aspect-[1.414/1] w-full bg-gradient-to-br from-amber-50 via-white to-amber-50 text-amber-950 p-12 md:p-16 relative flex flex-col items-center justify-between border-8 border-amber-300 shadow-2xl overflow-hidden rounded-lg"
              style={{
                fontFamily: "serif",
                background:
                  "linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fef3c7 100%)",
                borderColor: "#f59e0b",
                color: "#92400e",
              }}
            >
              {/* Decorative Borders */}
              <div
                className="absolute inset-6 border-2 border-amber-200/50 rounded-md"
                style={{ borderColor: "rgba(245, 158, 11, 0.5)" }}
              />
              <div
                className="absolute inset-10 border-[1px] border-amber-100/80 rounded"
                style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}
              />

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, transparent 50%, rgba(245, 158, 11, 0.2) 100%)",
                  }}
                />
              </div>

              {/* Header Branding */}
              <div className="text-center space-y-3 z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div
                    className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Award className="text-white h-7 w-7" />
                  </div>
                  <h4
                    className="text-lg font-bold tracking-wider uppercase text-amber-900"
                    style={{ color: "#92400e" }}
                  >
                    Loyal Academy
                  </h4>
                </div>
                <div
                  className="h-1 w-48 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 mx-auto rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
                    height: "4px",
                    width: "192px",
                    margin: "0 auto",
                    borderRadius: "9999px",
                  }}
                />
                <h1
                  className="text-4xl md:text-4xl font-black text-amber-950 tracking-wider uppercase mt-6 leading-tight"
                  style={{ color: "#92400e", fontSize: "2.5rem" }}
                >
                  Certificate of Completion
                </h1>
              </div>

              {/* Student Name Section */}
              <div className="text-center z-10 space-y-3 flex-grow flex flex-col justify-center">
                <p
                  className="text-base italic text-amber-800 font-serif"
                  style={{ color: "#92400e", fontStyle: "italic" }}
                >
                  This Certificate is Proudly Awarded To
                </p>
                <h2
                  className="text-5xl md:text-6xl font-bold text-amber-950 border-b-4 border-amber-400 px-8 pb-3 inline-block mx-auto"
                  style={{
                    color: "#92400e",
                    fontSize: "3.5rem",
                    borderBottom: "4px solid #f59e0b",
                    padding: "0 2rem 0.75rem 2rem",
                    display: "inline-block",
                    margin: "0 auto",
                  }}
                >
                  {userName}
                </h2>
                <p
                  className="text-base text-amber-900 mt-4 max-w-3xl mx-auto leading-relaxed font-serif"
                  style={{
                    color: "#92400e",
                    maxWidth: "48rem",
                    margin: "1rem auto 0 auto",
                  }}
                >
                  For successfully completing the rigorous curriculum and
                  demonstrating mastery in:
                </p>
                <h3
                  className="text-2xl md:text-3xl font-bold uppercase text-amber-900 mt-2 tracking-tight font-serif"
                  style={{
                    color: "#92400e",
                    fontSize: "2rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {selectedCert.course.title}
                </h3>

                {/* Achievement Details */}
                <div className="flex justify-center gap-8 mt-6">
                  <div className="text-center">
                    <p
                      className="text-sm font-bold text-amber-800 uppercase tracking-widest"
                      style={{
                        color: "#92400e",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      Grade
                    </p>
                    <p
                      className="text-2xl font-black text-amber-950"
                      style={{
                        color: "#92400e",
                        fontSize: "1.5rem",
                        fontWeight: "900",
                      }}
                    >
                      {selectedCert.grade || "A+"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm font-bold text-amber-800 uppercase tracking-widest"
                      style={{
                        color: "#92400e",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      Final Score
                    </p>
                    <p
                      className="text-2xl font-black text-amber-950"
                      style={{
                        color: "#92400e",
                        fontSize: "1.5rem",
                        fontWeight: "900",
                      }}
                    >
                      {selectedCert.finalScore?.toFixed(1) || "95.0"}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Section with Seal */}
              <div className="w-full flex justify-between items-end z-10 mt-4 px-4">
                <div className="text-left space-y-1">
                  <p
                    className="text-[9px] text-amber-700 uppercase font-bold tracking-widest"
                    style={{
                      color: "#92400e",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    Certificate No:{" "}
                    <span
                      className="text-amber-900 font-serif"
                      style={{ color: "#92400e" }}
                    >
                      {selectedCert.certificateNumber}
                    </span>
                  </p>
                  <p
                    className="text-[9px] text-amber-700 uppercase font-bold tracking-widest"
                    style={{
                      color: "#92400e",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    Issued:{" "}
                    <span
                      className="text-amber-900 font-serif"
                      style={{ color: "#92400e" }}
                    >
                      {new Date(selectedCert.issueDate).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </p>
                  <p
                    className="text-[9px] text-amber-700 uppercase font-bold tracking-widest"
                    style={{
                      color: "#92400e",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    Grade:{" "}
                    <span
                      className="text-amber-900 font-serif"
                      style={{ color: "#92400e" }}
                    >
                      {selectedCert.grade || "A+"}
                    </span>
                  </p>
                  <p
                    className="text-[9px] text-amber-700 uppercase font-bold tracking-widest"
                    style={{
                      color: "#92400e",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    Final Score:{" "}
                    <span
                      className="text-amber-900 font-serif"
                      style={{ color: "#92400e" }}
                    >
                      {selectedCert.finalScore?.toFixed(1) || "95.0"}%
                    </span>
                  </p>
                </div>

                {/* THE GOLD SEAL */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-20 h-20 bg-gradient-to-br from-yellow-600 via-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200 relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #ca8a04 0%, #fbbf24 50%, #d97706 100%)",
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      border: "4px solid #fde047",
                      position: "relative",
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full border-2 border-yellow-300/50"
                      style={{
                        position: "absolute",
                        inset: "4px",
                        borderRadius: "50%",
                        border: "2px solid rgba(253, 224, 71, 0.5)",
                      }}
                    />
                    <div
                      className="text-center leading-none z-10"
                      style={{
                        textAlign: "center",
                        lineHeight: "1",
                        position: "relative",
                        zIndex: "10",
                      }}
                    >
                      <p
                        className="text-sm font-black text-yellow-900 uppercase"
                        style={{
                          color: "#92400e",
                          fontSize: "14px",
                          fontWeight: "900",
                        }}
                      >
                        LA
                      </p>
                      <p
                        className="text-[7px] font-bold text-yellow-800 uppercase tracking-tighter mt-0.5 leading-none"
                        style={{
                          color: "#92400e",
                          fontSize: "7px",
                          fontWeight: "bold",
                          marginTop: "2px",
                          lineHeight: "1",
                        }}
                      >
                        Official
                        <br />
                        Certified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p
                    className="text-sm font-serif italic text-amber-900 font-bold"
                    style={{
                      color: "#92400e",
                      fontSize: "14px",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    Director
                  </p>
                  <div
                    className="h-1 bg-amber-400 w-32 mx-auto rounded-full"
                    style={{
                      backgroundColor: "#f59e0b",
                      height: "4px",
                      width: "128px",
                      margin: "0 auto",
                      borderRadius: "9999px",
                    }}
                  />
                  <p
                    className="text-[8px] uppercase font-bold text-amber-700 tracking-wider mt-1"
                    style={{
                      color: "#92400e",
                      fontSize: "8px",
                      fontWeight: "bold",
                      marginTop: "4px",
                    }}
                  >
                    Loyal Academy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
