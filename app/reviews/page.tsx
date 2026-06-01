import StaticPage from '@/components/StaticPage';

export default function ReviewsPage() {
  return (
    <StaticPage titleEn="Reviews" titleTh="รีวิว">
      <p>Guests travel with us for the light, the pace, and the photos they take home.</p>
      <blockquote className="border-l-4 border-gold pl-4 italic">
        “Small group, beautiful locations, and พี่แสน knows exactly when to shoot.”
      </blockquote>
      <blockquote className="border-l-4 border-teal pl-4 italic">
        “ไม่เหนื่อย ไม่เร่ง ได้รูปสวยทุกวัน”
      </blockquote>
    </StaticPage>
  );
}
