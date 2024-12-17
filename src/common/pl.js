import moment from 'moment';
import { upstoxClient } from '../config/upstox';

export async function getFinalPLData(from_date, to_date, financial_year) {
  // Step 1: Call the /metadata API
  const metadata = await upstoxClient.getReportMetadata(
    from_date,
    to_date,
    financial_year,
  );

  const charges = await upstoxClient.getCharges(
    from_date,
    to_date,
    financial_year,
  );
  //   const metadata = await metadataResponse.json();

  if (metadata.status !== 'success') {
    throw new Error('Failed to fetch metadata');
  }

  const tradesCount = metadata.data.trades_count;
  const pageSizeLimit = metadata.data.page_size_limit;
  let allPLData = [];
  let pageNumber = 1;

  // Step 2: Call the /pl_report API iteratively if tradesCount > pageSizeLimit
  do {
    const plReport = await upstoxClient.getReportPLData(
      from_date,
      to_date,
      financial_year,
      pageNumber,
    );
    // const plReport = await plReportResponse.json();

    if (plReport.status !== 'success') {
      throw new Error('Failed to fetch PL report');
    }

    allPLData = allPLData.concat(plReport.data);
    pageNumber++;
  } while (allPLData.length < tradesCount && allPLData.length < pageSizeLimit);

  // Step 3: Calculate the final return object
  const profitData = {};
  let totalProfit = 0;
  let startDate = null;

  allPLData.forEach(trade => {
    const profit = trade.sell_amount - trade.buy_amount;
    const date = trade.buy_date; // Assuming buy_date is the date for profit calculation

    if (!profitData[date]) {
      profitData[date] = {
        date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        value: 0,
      };
    }
    profitData[date].value += profit;
    totalProfit += profit;

    if (!startDate || new Date(date) < new Date(startDate)) {
      startDate = date;
    }
  });
  const dailyProfits = Object.values(profitData).map(v => v.value);
  const maxProfit = Math.max(...dailyProfits); // Maximum profit from all days
  const minProfit = Math.min(...dailyProfits); // Minimum profit from all days
  const _charges = charges?.data?.charges_breakdown;
  if (_charges) {
    totalProfit = totalProfit - _charges.total;
  }
  return {
    day: Object.values(profitData),
    total: totalProfit,
    max: maxProfit,
    min: minProfit,
    startDate: moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    chargesDetails: _charges,
    charges: _charges.total,
  };
}
