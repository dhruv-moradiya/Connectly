const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex justify-center my-4">
    <div className="bg-primary/5 text-xs px-1 py-0.5 rounded-md border select-none">
      {date}
    </div>
  </div>
);

export default DateSeparator;
