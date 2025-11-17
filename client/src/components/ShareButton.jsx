import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

const ShareButton = ({ url }) => {

  const handleShare = async () => {
    
    if (navigator.share) {
            
            try {

                    await navigator.share({
                        
                      url:url   //fsq is a query passed to increase view count in a video
                        
                    });

                    // console.log("url : ", url );
                    // console.log("href : ", window.location.href)

            } catch (error) {

                    console.error("Share failed:", error);

            }
    
    } else {

        // fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(url || window.location.href);

        alert("Link copied to clipboard!");

    }
  
};

  return (
  
    <div  onClick={handleShare}
    
        style={{
            marginTop:"5px",
            borderRadius: "8px",
            color: "#fff",
            border: "none",
            cursor: "pointer",
    
        }} > <ReplyOutlinedIcon /> Share </div>
  );

};

export default ShareButton;
