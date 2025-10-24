import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram access token not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,like_count,permalink,timestamp&limit=12&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram posts");
    }

    const data = await response.json();

    const posts =
      data.data
        ?.filter(
          (post: any) =>
            post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM"
        )
        .slice(0, 6)
        .map((post: any) => {
          const truncatedCaption = post.caption
            ? post.caption.length > 200
              ? post.caption.substring(0, 200) + "..."
              : post.caption
            : "";

          return {
            id: post.id,
            username: "@cultofdrive",
            content: truncatedCaption,
            imageUrl: post.media_url,
            profilePic: "/images/profile.png",
            timestamp: post.timestamp,
            like_count: post.like_count || 0,
            url: post.permalink,
          };
        }) || [];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Instagram API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts" },
      { status: 500 }
    );
  }
}
