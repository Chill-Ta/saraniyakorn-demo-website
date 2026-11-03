interface SectionHeadingProps {
  title: string;
  description?: string;
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col w-full">
      <h2 className="w-full text-[#404041] text-left font-serif text-[40px] lg:text-[48px] font-bold leading-[1.2]">
        {title}
      </h2>
      {description && (
        <p className="text-[#6D6D6D] font-serif text-[16px] leading-[24px] mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
