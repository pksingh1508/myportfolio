import Image from "next/image";
import type { ProjectMedia } from "../../types/portfolio";

type ProjectMediaFigureProps = {
  readonly media: ProjectMedia;
};

/**
 * Reusable case-study figure driven by the Step 2 media contract: intrinsic
 * dimensions always, meaningful alt text or an explicit decorative flag, and
 * a poster for video. Images lazy-load through next/image; video never
 * autoplays and always ships native controls with preload="none" so the
 * poster (not the file) is the only upfront cost. No figcaption is rendered:
 * the model carries no caption field, and repeating alt text as a caption
 * would double-announce it to screen readers.
 */
export default function ProjectMediaFigure({
  media,
}: ProjectMediaFigureProps) {
  if (media.type === "video") {
    return (
      <figure>
        <video
          src={media.src}
          poster={media.poster}
          width={media.width}
          height={media.height}
          controls
          preload="none"
          playsInline
          aria-label={media.decorative ? undefined : media.alt}
          aria-hidden={media.decorative || undefined}
        >
          Sorry, your browser does not support embedded video.
        </video>
      </figure>
    );
  }

  if (media.decorative) {
    return (
      <figure aria-hidden="true">
        <Image
          src={media.src}
          alt=""
          width={media.width}
          height={media.height}
          sizes="(max-width: 768px) 100vw, 64rem"
        />
      </figure>
    );
  }

  return (
    <figure>
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes="(max-width: 768px) 100vw, 64rem"
      />
    </figure>
  );
}
