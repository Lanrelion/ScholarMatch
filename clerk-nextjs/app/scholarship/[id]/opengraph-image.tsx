import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function DefaultOGImage() {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: "60px",
        fontFamily: "sans-serif",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "8px",
        backgroundColor: "#1D9E75"
      }} />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80px",
        height: "80px",
        backgroundColor: "#1D9E75",
        borderRadius: "20px",
        color: "white",
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "24px"
      }}>SM</div>
      <div style={{ fontSize: "48px", fontWeight: "bold", color: "#111827" }}>ScholarMatch</div>
      <div style={{ fontSize: "24px", color: "#6B7280", marginTop: "16px" }}>Find your perfect scholarship match</div>
    </div>
  );
}

export default async function OGImage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const scholarship = await db.scholarship.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      provider: true,
      deadline: true,
      eligibilityParsed: true,
      eligibleDegrees: true,
    }
  });

  if (!scholarship) {
    return new ImageResponse(<DefaultOGImage />, { width: 1200, height: 630 });
  }

  const parsed = scholarship.eligibilityParsed as any;
  const fundingType = parsed?.fundingType === "full"
    ? "Fully funded" : "Scholarship";

  const deadline = scholarship.deadline
    ? new Date(scholarship.deadline)
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
    : "Open deadline";

  const degreeLabel = scholarship.eligibleDegrees
    .map((d: string) => 
      d === "MASTERS" ? "Masters"
      : d === "PHD" ? "PhD"
      : "Undergraduate"
    )
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "8px",
          backgroundColor: "#1D9E75"
        }} />

        {/* ScholarMatch label (top left) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px"
        }}>
          <div style={{
            width: "32px", height: "32px",
            backgroundColor: "#1D9E75",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            marginRight: "10px"
          }}>SM</div>
          <span style={{ 
            fontSize: "18px", 
            color: "#6B7280",
            fontWeight: "500"
          }}>ScholarMatch</span>
        </div>

        {/* Funding badge */}
        <div style={{
          display: "flex",
          marginBottom: "20px"
        }}>
          <div style={{
            backgroundColor: "#E1F5EE",
            color: "#0F6E56",
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "16px",
            fontWeight: "600"
          }}>{fundingType}</div>
        </div>

        {/* Scholarship title */}
        <div style={{
          display: "flex",
          fontSize: scholarship.title.length > 60 
            ? "32px" : "40px",
          fontWeight: "700",
          color: "#111827",
          lineHeight: "1.2",
          marginBottom: "16px",
          maxWidth: "900px"
        }}>{scholarship.title}</div>

        {/* Funder */}
        <div style={{
          display: "flex",
          fontSize: "22px",
          color: "#6B7280",
          marginBottom: "40px"
        }}>{scholarship.provider}</div>

        {/* Bottom metadata row */}
        <div style={{
          display: "flex",
          gap: "32px",
          marginTop: "auto"
        }}>
          <div style={{ display: "flex", 
                        flexDirection: "column" }}>
            <span style={{ 
              fontSize: "13px", 
              color: "#9CA3AF",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Deadline</span>
            <span style={{ 
              fontSize: "18px", 
              color: "#111827",
              fontWeight: "600"
            }}>{deadline}</span>
          </div>
          <div style={{ display: "flex", 
                        flexDirection: "column" }}>
            <span style={{ 
              fontSize: "13px", 
              color: "#9CA3AF",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Level</span>
            <span style={{ 
              fontSize: "18px", 
              color: "#111827",
              fontWeight: "600"
            }}>{degreeLabel || "All levels"}</span>
          </div>
          <div style={{ 
            marginLeft: "auto",
            display: "flex",
            alignItems: "flex-end"
          }}>
            <span style={{ 
              fontSize: "16px", 
              color: "#1D9E75",
              fontWeight: "600"
            }}>Find your match at ScholarMatch →</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
