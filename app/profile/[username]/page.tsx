import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserPublicProfile } from "@/lib/snippets/snippet-service";
import { generateProfileMetadata } from "@/lib/seo/metadata";
import { generatePersonStructuredData } from "@/lib/seo/structured-data";
import ProfilePageClient from "./ProfilePageClient";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const profile = getUserPublicProfile(params.username);

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "The requested user profile could not be found.",
    };
  }

  return generateProfileMetadata(profile.user, profile.stats);
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = getUserPublicProfile(params.username);

  if (!profile) {
    notFound();
  }

  const structuredData = generatePersonStructuredData(
    profile.user,
    profile.stats
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProfilePageClient profile={profile} />
    </>
  );
}
