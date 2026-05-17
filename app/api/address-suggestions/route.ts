import type { NextRequest } from "next/server";

type NominatimResult = {
  display_name?: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    postcode?: string;
  };
};

function formatAddress(result: NominatimResult) {
  const address = result.address;
  if (!address) return result.display_name;

  const locality =
    address.suburb ??
    address.neighbourhood ??
    address.city ??
    address.town ??
    address.village;
  const parts = [
    address.road,
    locality,
    address.city,
    address.county,
    address.postcode,
  ]
    .filter(Boolean)
    .filter((part, index, items) => items.indexOf(part) === index);

  return parts.length > 0 ? parts.join(", ") : result.display_name;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return Response.json({ suggestions: [] });
  }

  const params = new URLSearchParams({
    q: `${query}, Dublin, Ireland`,
    format: "jsonv2",
    addressdetails: "1",
    limit: "10",
    countrycodes: "ie",
    viewbox: "-6.53,53.45,-6.04,53.20",
    bounded: "1",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "Fixora UI address autocomplete",
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return Response.json({ suggestions: [] }, { status: response.status });
    }

    const results = (await response.json()) as NominatimResult[];
    const suggestions = Array.from(
      new Set(
        results
          .map(formatAddress)
          .filter((value): value is string => Boolean(value)),
      ),
    ).slice(0, 8);

    return Response.json({ suggestions });
  } catch {
    return Response.json({ suggestions: [] });
  }
}
