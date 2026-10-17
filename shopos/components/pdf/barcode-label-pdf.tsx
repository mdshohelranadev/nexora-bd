// components/pdf/barcode-label-pdf.tsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import Barcode from 'react-barcode';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Product } from '@/lib/types';

/**
 * A4 = 595 x 842 pt
 * We render 3 columns × 10 rows = 30 labels.
 * Each label: ~180pt wide × 80pt tall.
 *
 * react-barcode outputs SVG. We render it to a static markup string
 * and inline the SVG inside a <View> using dangerouslySetInnerHTML-like
 * approach — however react-pdf doesn't render HTML, so we instead use
 * a `<Svg>` component with the barcode as an <Image> via data URL.
 *
 * Simpler: use `react-barcode` render to produce an SVG string, then
 * feed it as a data-URI image to react-pdf's Image primitive.
 */

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    width: '33.333%',
    height: 82,
    padding: 6,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  name: {
    fontSize: 7,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.15,
    height: 16,
    overflow: 'hidden',
  },
  barcodeWrap: {
    height: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeImg: {
    height: 34,
    maxWidth: '100%',
    objectFit: 'contain',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: 6,
    color: '#333',
  },
  price: {
    fontWeight: 700,
    fontSize: 8,
  },
});

const bdt = (n: number) => {
  const rounded = Math.round(n);
  return `৳${rounded.toLocaleString('en-IN')}`;
};

/** Convert React Barcode -> data URL (base64 SVG) */
function barcodeDataUrl(value: string, opts: {
  width?: number;
  height?: number;
  fontSize?: number;
  margin?: number;
} = {}): string {
  const svgString = renderToStaticMarkup(
    <Barcode
      value={value}
      format="EAN13"
      width={opts.width ?? 1.2}
      height={opts.height ?? 30}
      fontSize={opts.fontSize ?? 8}
      margin={opts.margin ?? 0}
      displayValue={false}
      background="#ffffff"
      lineColor="#000000"
    />
  );
  // encode
  const base64 = Buffer.from(svgString).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

interface Props {
  products: Product[];
  copiesPerProduct?: number;
  showPrice?: boolean;
  showSku?: boolean;
  showName?: boolean;
}

export function BarcodeLabelPDF({
  products,
  copiesPerProduct = 1,
  showPrice = true,
  showSku = true,
  showName = true,
}: Props) {
  // Expand products by copies
  const labels: Product[] = [];
  products.forEach((p) => {
    for (let i = 0; i < copiesPerProduct; i++) labels.push(p);
  });

  // Chunk into pages of 30
  const pageSize = 30;
  const pages: Product[][] = [];
  for (let i = 0; i < labels.length; i += pageSize) {
    pages.push(labels.slice(i, i + pageSize));
  }
  if (!pages.length) pages.push([]);

  return (
    <Document>
      {pages.map((pageLabels, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
          <View style={styles.grid}>
            {pageLabels.map((p, i) => {
              // safe EAN13: digits only, pad to 12 + checksum handled by react-barcode; but we need 12 or 13 digits
              let code = p.barcode.replace(/\D/g, '');
              if (code.length < 12) code = code.padEnd(12, '0');
              if (code.length > 13) code = code.slice(0, 13);

              const dataUrl = barcodeDataUrl(code, {
                width: 1.2,
                height: 30,
                fontSize: 6,
              });

              return (
                <View key={i} style={styles.label} wrap={false}>
                  {showName && <Text style={styles.name}>{p.name}</Text>}
                  <View style={styles.barcodeWrap}>
                    {/* react-pdf accepts SVG data URLs through Image */}
                    <Image src={dataUrl} style={styles.barcodeImg} />
                  </View>
                  <View style={styles.meta}>
                    {showSku ? <Text>{p.sku}</Text> : <Text> </Text>}
                    {showPrice ? <Text style={styles.price}>{bdt(p.sellingPrice)}</Text> : <Text> </Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
}

// React PDF Image primitive
import { Image } from '@react-pdf/renderer';