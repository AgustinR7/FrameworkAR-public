import { useRef } from "react";
import { Box, Avatar } from "@mui/material";

interface ProfilePictureProps {
  pfpUrl: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePicture({ pfpUrl, onUpload }: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      onClick={handleAvatarClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        width: 250,
        height: 250,
        margin: "20px",
        "&:hover .hover-overlay": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${pfpUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) saturate(1.5)",
          transform: "scale(1.3)",
          borderRadius: "50%",
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      <Avatar
        alt="Profile Picture"
        src={pfpUrl}
        sx={{ 
          width: "100%", 
          height: "100%", 
          position: "relative",
          zIndex: 1, 
          backgroundColor: "transparent",
          maskImage: "radial-gradient(circle, black 80%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle, black 80%, transparent 100%)"
        }}
      />
      
      <Box
        className="hover-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 2,
          borderRadius: "50%",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
          Cambiar<br/>foto
        </span>
      </Box>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onUpload}
      />
    </Box>
  );
}