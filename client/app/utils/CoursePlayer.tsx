import React, { FC, useEffect, useState } from "react";
import axios from "axios";
type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    axios
      .post(`http://localhost:5000/api/v1/get-VdoCipherOTP`, {
        videoId: videoUrl,
      })
      .then((res) => {
        setVideoData(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, [videoUrl]);

  return (
    <div
      style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
    >
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=5YsOAqc44KSDH3HS`}
          style={{
            border: 0,
            maxWidth: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        />
      )}
    </div>
  );
};

export default CoursePlayer;