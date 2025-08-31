export const Footer = () => {
  return (
    <footer className="text-center py-6 border-t text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        © {new Date().getFullYear()} HRIS Management. asguard All rights
        reserved.
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
