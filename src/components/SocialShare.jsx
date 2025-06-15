import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export default function SocialShare() {
  const shareUrl = "https://jarvischat.pages.dev";
  const shareText = `Saya barusan ngobrol sama Jarvis, chat AI yang baru! Coba deh:`;

  return (
    <div className="flex gap-2 justify-center items-center mt-6">
      <FacebookShareButton url={shareUrl} quote={shareText}>
        <FacebookIcon size={24} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={shareText}>
        <TwitterIcon size={24} round />
      </TwitterShareButton>

      <WhatsappShareButton url={shareUrl} title={shareText}>
        <WhatsappIcon size={24} round />
      </WhatsappShareButton>
    </div>
  );
}
