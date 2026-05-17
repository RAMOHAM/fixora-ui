"use client";

import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormProps } from "@/app/book/page";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

const DUBLIN_AREAS = [
  "Dublin 1 - City Centre North",
  "Dublin 2 - City Centre South",
  "Dublin 3 - Clontarf, Fairview, Marino",
  "Dublin 4 - Ballsbridge, Donnybrook, Ringsend",
  "Dublin 5 - Artane, Raheny, Killester",
  "Dublin 6 - Rathmines, Ranelagh, Terenure",
  "Dublin 6W - Harold's Cross, Kimmage, Terenure",
  "Dublin 7 - Phibsborough, Stoneybatter, Smithfield",
  "Dublin 8 - Portobello, Kilmainham, Liberties",
  "Dublin 9 - Drumcondra, Santry, Glasnevin",
  "Dublin 10 - Ballyfermot, Cherry Orchard",
  "Dublin 11 - Finglas, Ballymun",
  "Dublin 12 - Crumlin, Walkinstown, Drimnagh",
  "Dublin 13 - Howth, Sutton, Bayside",
  "Dublin 14 - Dundrum, Churchtown, Clonskeagh",
  "Dublin 15 - Blanchardstown, Castleknock, Clonsilla",
  "Dublin 16 - Ballinteer, Knocklyon, Rathfarnham",
  "Dublin 17 - Belcamp, Darndale, Priorswood",
  "Dublin 18 - Sandyford, Stepaside, Leopardstown",
  "Dublin 20 - Palmerstown, Chapelizod",
  "Dublin 22 - Clondalkin, Neilstown",
  "Dublin 24 - Tallaght, Firhouse, Citywest",
  "Blackrock, County Dublin",
  "Dun Laoghaire, County Dublin",
  "Malahide, County Dublin",
  "Swords, County Dublin",
  "Lucan, County Dublin",
];

const SAMPLE_DUBLIN_ADDRESSES = [
  "15 Merrion Square, Dublin 2",
  "Rathmines Road Lower, Dublin 6",
  "Ranelagh Village, Dublin 6",
  "Drumcondra Road Upper, Dublin 9",
  "Clontarf Road, Dublin 3",
  "Baggot Street Upper, Dublin 4",
  "Camden Street Lower, Dublin 2",
  "South Circular Road, Dublin 8",
  "Stoneybatter, Dublin 7",
  "Stillorgan Road, Dublin 4",
];

const EIRCODE_AREA_BY_ROUTING_KEY: Record<string, string> = {
  D01: "Dublin 1",
  D02: "Dublin 2",
  D03: "Dublin 3",
  D04: "Dublin 4",
  D05: "Dublin 5",
  D06: "Dublin 6",
  D6W: "Dublin 6W",
  D07: "Dublin 7",
  D08: "Dublin 8",
  D09: "Dublin 9",
  D10: "Dublin 10",
  D11: "Dublin 11",
  D12: "Dublin 12",
  D13: "Dublin 13",
  D14: "Dublin 14",
  D15: "Dublin 15",
  D16: "Dublin 16",
  D17: "Dublin 17",
  D18: "Dublin 18",
  D20: "Dublin 20",
  D22: "Dublin 22",
  D24: "Dublin 24",
};

function getDublinAreaFromEircode(value: string) {
  const normalized = value.toUpperCase().replace(/\s+/g, "");
  const routingKey = normalized.slice(0, 3);
  return EIRCODE_AREA_BY_ROUTING_KEY[routingKey] ?? null;
}

const AddressDetailsForm = ({ onNext, onBack }: MultiStepFormProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: dateOfJobRef, ...dateOfJobRegister } = register("dateOfJob");
  const {
    ref: addressRef,
    onChange: onAddressChange,
    ...addressRegister
  } = register("address");
  const addressValue = watch("address");
  const [addressQuery, setAddressQuery] = useState(addressValue ?? "");
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [remoteAddressSuggestions, setRemoteAddressSuggestions] = useState<
    string[]
  >([]);
  const recognizedEircodeArea = getDublinAreaFromEircode(addressQuery);

  useEffect(() => {
    const query = addressQuery.trim();

    if (query.length < 3 || recognizedEircodeArea) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/address-suggestions?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const payload = await response.json().catch(() => null);
        setRemoteAddressSuggestions(
          Array.isArray(payload?.suggestions) ? payload.suggestions : [],
        );
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          setRemoteAddressSuggestions([]);
        }
      }
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [addressQuery, recognizedEircodeArea]);

  const addressSuggestions = useMemo(() => {
    const query = addressQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    const eircodeArea = getDublinAreaFromEircode(addressQuery);
    const eircodeSuggestion = eircodeArea
      ? [`${addressQuery.toUpperCase()} - recognized as ${eircodeArea}`]
      : [];

    const localMatches = [...SAMPLE_DUBLIN_ADDRESSES, ...DUBLIN_AREAS]
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 6);

    const effectiveRemoteSuggestions =
      query.length >= 3 && !eircodeArea ? remoteAddressSuggestions : [];

    return Array.from(
      new Set([
        ...eircodeSuggestion,
        ...effectiveRemoteSuggestions,
        ...localMatches,
      ]),
    ).slice(0, 9);
  }, [addressQuery, remoteAddressSuggestions]);

  const selectAddressSuggestion = (suggestion: string) => {
    const value = suggestion.includes(" - recognized as ")
      ? suggestion.replace(" - recognized as ", ", ")
      : suggestion;

    setValue("address", value, { shouldDirty: true, shouldValidate: true });
    setAddressQuery(value);
    setIsAddressFocused(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
        Where and when?
      </h1>

      {/* Address Section */}
      <div className="space-y-4">
        <label className="text-sm font-bold uppercase tracking-widest text-[#B99525]">
          SERVICE ADDRESS (DUBLIN RESIDENTS)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="text-[#847B62] stroke-[2]" size={20} />
          </div>
          <input
            type="text"
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-[#847B62]/70 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base",
              errors.address &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
            )}
            placeholder="Start typing a Dublin address or eircode..."
            autoComplete="street-address"
            {...addressRegister}
            ref={addressRef}
            onFocus={() => setIsAddressFocused(true)}
            onBlur={() =>
              window.setTimeout(() => setIsAddressFocused(false), 120)
            }
            onChange={(event) => {
              setAddressQuery(event.target.value);
              onAddressChange(event);
            }}
          />
          {isAddressFocused && addressSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {addressSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-[#f5f6f4]"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectAddressSuggestion(suggestion)}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#847B62]" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {recognizedEircodeArea && (
          <p className="text-sm font-medium text-emerald-700">
            Eircode recognized: {recognizedEircodeArea}
          </p>
        )}
        {errors.address && (
          <span className="text-red-500 text-sm font-medium mt-1 inline-block">
            {errors.address.message}
          </span>
        )}
      </div>

      {/* Date & Time Window Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            SELECT DATE
          </label>
          <div className="relative">
            <input
              type="date"
              className={cn(
                "w-full pl-4 pr-12 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-gray-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base",
                errors.dateOfJob &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
              )}
              {...dateOfJobRegister}
              ref={(el) => {
                dateOfJobRef(el);
                dateInputRef.current = el;
              }}
            />
            <button
              type="button"
              aria-label="Open date picker"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => {
                const el = dateInputRef.current;
                if (!el) return;
                // Prefer opening the native picker when supported.
                (el as unknown as { showPicker?: () => void }).showPicker?.();
                el.focus();
              }}
            >
              <Calendar className="text-gray-800 stroke-[2]" size={20} />
            </button>
          </div>
          {errors.dateOfJob && (
            <span className="text-red-500 text-sm font-medium mt-1 inline-block">
              {errors.dateOfJob.message}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            PREFERRED WINDOW
          </label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-12 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base appearance-none cursor-pointer"
              defaultValue="morning"
              {...register("preferredWindow")}
            >
              <option value="morning">Morning (08:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 16:00)</option>
              <option value="evening">Evening (16:00 - 20:00)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDown className="text-gray-500 stroke-[2]" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="px-8 py-6 w-full md:w-auto text-lg rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-bold"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="px-8 py-6 w-full md:w-auto text-lg rounded-xl bg-brand-gradient text-white hover:opacity-90 transition-opacity font-bold shadow-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
