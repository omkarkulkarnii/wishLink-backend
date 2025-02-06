import fetchProductData from './scrapper.js';

async function test() {
    const result = await fetchProductData(`https://www.myntra.com/trousers/chic+by+tokyo+talkies/chic-by-tokyo-talkies-women-flared-fit-high-rise-parallel-trousers/24567748/buy`);
    console.log(result);
}




//https://www.flipkart.com/panasonic-convertible-7-in-1-additional-ai-mode-cooling-2023-model-1-5-ton-3-star-split-inverter-2-way-swing-pm-0-1-air-purification-filter-ac-wi-fi-connect-white/p/itm55b869e4cbdc0?pid=ACNGHHH24J62PGNV&lid=LSTACNGHHH24J62PGNVODJGXG&marketplace=FLIPKART&fm=neo%2Fmerchandising&iid=M_d3ec7292-075b-45ab-9483-e30db512f0da_21_QATBZR4PNDGC_MC.ACNGHHH24J62PGNV&ppt=hp&ppn=homepage&ssid=5f70qilsdc0000001738746223599&otracker=clp_pmu_v2_Air%2BConditioners_3_21.productCard.PMU_V2_Panasonic%2BConvertible%2B7-in-1%2Bwith%2BAdditional%2BAI%2BMode%2BCooling%2B2023%2BModel%2B1.5%2BTon%2B3%2BStar%2BSplit%2BInverter%2Bwith%2B2%2BWay%2BSwing%252C%2BPM%2B0.1%2BAir%2BPurification%2BFilter%2BAC%2Bwith%2BWi-fi%2BConnect%2B%2B-%2BWhite_tvs-and-appliances-new-clp-store_ACNGHHH24J62PGNV_neo%2Fmerchandising_2&otracker1=clp_pmu_v2_PINNED_neo%2Fmerchandising_Air%2BConditioners_LIST_productCard_cc_3_NA_view-all&cid=ACNGHHH24J62PGNV

//https://www.myntra.com/trousers/chic+by+tokyo+talkies/chic-by-tokyo-talkies-women-flared-fit-high-rise-parallel-trousers/24567748/buy

//https://www.amazon.in/Zebronics-Zeb-ASC100-Cable-3-5mm-Black/dp/B081QC357T/?_encoding=UTF8&ref_=pd_hp_d_btf_cr_cartx











test();
