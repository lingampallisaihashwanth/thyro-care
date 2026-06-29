import { ArrowDownAZ, ArrowUpAZ, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookingModal } from "../components/BookingModal";
import { labTests, testCategories } from "../data/tests";
import type { Booking, LabTest, TestCategory } from "../types";
import {
  formatTranslatedPrice,
  translateReportTime,
  translateTestCategory,
  translateTestDescription,
  translateTestName,
} from "../utils/translation";

type CategoryFilter = "All" | TestCategory;
type SortMode = "featured" | "priceLow" | "priceHigh";

export const Tests = () => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const navigate = useNavigate();
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;

  const filteredTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = labTests.filter((test) => {
      const translatedName = translateTestName(t, test.name).toLowerCase();
      const translatedCategory = translateTestCategory(t, test.category).toLowerCase();
      const translatedDescription = translateTestDescription(t, test).toLowerCase();
      const matchesCategory = category === "All" || test.category === category;
      const matchesQuery =
        !normalizedQuery ||
        test.name.toLowerCase().includes(normalizedQuery) ||
        translatedName.includes(normalizedQuery) ||
        test.category.toLowerCase().includes(normalizedQuery) ||
        translatedCategory.includes(normalizedQuery) ||
        test.description.toLowerCase().includes(normalizedQuery) ||
        translatedDescription.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    if (sortMode === "featured") {
      return matches;
    }

    return [...matches].sort((a, b) => {
      if (a.price === null && b.price === null) {
        return 0;
      }

      if (a.price === null) {
        return 1;
      }

      if (b.price === null) {
        return -1;
      }

      return sortMode === "priceLow" ? a.price - b.price : b.price - a.price;
    });
  }, [category, i18n.language, query, sortMode, t]);

  const handleBooked = (booking: Booking) => {
    setSelectedTest(null);
    navigate("/profile", {
      state: {
        bookingSuccess: tr("booking.messages.submitted", "Booking submitted successfully."),
        booking,
      },
    });
  };

  return (
    <main className="bg-white">
      <section className="bg-thyro-sky px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase text-thyro-green">
            {tr("tests.eyebrow", "Laboratory Tests")}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black text-thyro-navy">
            {tr("tests.heading", "Search, filter, and book your laboratory test.")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {tr(
              "tests.subheading",
              "Select a test first. The booking form opens only after you choose Book Test.",
            )}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-crisp lg:grid-cols-[1.2fr_0.9fr_0.8fr]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr("tests.searchPlaceholder", "Search tests")}
                className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              />
            </label>

            <label className="relative block">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as CategoryFilter)}
                className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              >
                <option value="All">{tr("tests.allCategories", "All Categories")}</option>
                {testCategories.map((item) => (
                  <option key={item} value={item}>
                    {translateTestCategory(t, item)}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative block">
              {sortMode === "priceHigh" ? (
                <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              ) : (
                <ArrowUpAZ className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              )}
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              >
                <option value="featured">{tr("tests.sort.default", "Default Order")}</option>
                <option value="priceLow">{tr("tests.sort.lowHigh", "Price: Low to High")}</option>
                <option value="priceHigh">{tr("tests.sort.highLow", "Price: High to Low")}</option>
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTests.map((test) => (
              <article
                key={`${test.category}-${test.name}`}
                className="flex min-h-[320px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-crisp"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-thyro-green">
                      {translateTestCategory(t, test.category)}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-thyro-navy">
                      {translateTestName(t, test.name)}
                    </h2>
                  </div>
                  <span className="rounded-full bg-thyro-sky px-3 py-1 text-sm font-extrabold text-thyro-blue">
                    {formatTranslatedPrice(t, test.price)}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                  {translateTestDescription(t, test)}
                </p>
                <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm">
                  <span className="font-bold text-slate-500">
                    {tr("tests.reportTime", "Report Time: ")}
                  </span>
                  <span className="font-bold text-thyro-navy">
                    {translateReportTime(t, test.reportTime)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTest(test)}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-thyro-green px-5 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700"
                >
                  {tr("common.bookTest", "Book Test")}
                </button>
              </article>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-bold text-thyro-navy">
                {tr("tests.emptyTitle", "No tests found")}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {tr("tests.emptyText", "Try a different search or category filter.")}
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedTest && (
        <BookingModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onBooked={handleBooked}
        />
      )}
    </main>
  );
};
