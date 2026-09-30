/**
 * ============================================================================
 * INBIOLOGY ACADEMY — Google Apps Script for Automated Financial & Sales Sync
 * ============================================================================
 * ระบบบันทึกบัญชีรายรับ ยอดขายแยกรายคอร์ส และสรุปยอดประจำเดือนอัตโนมัติ
 * 
 * 📌 คำแนะนำการติดตั้ง (ทำครั้งเดียว ไม่เกิน 2 นาที):
 * 1. สร้าง Google Sheet ใหม่ (ตั้งชื่อ เช่น "INBIOLOGY — บัญชีรายรับ & ยอดขาย")
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) ➔ "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมด แล้วคัดลอกโค้ดนี้ไปวาง ➔ กด "บันทึก" (รูปแผ่นดิสก์)
 * 4. กดปุ่มสีน้ำเงินมุมขวาบน "การทำให้ใช้งานได้" (Deploy) ➔ "การปรับใช้ใหม่" (New deployment)
 * 5. เลือกประเภทเป็น "เว็บแอป" (Web app):
 *    - คำอธิบาย: INBIOLOGY Financial Sync
 *    - ดำเนินการในฐานะ: ตัวฉัน (Me)
 *    - ใครมีสิทธิ์เข้าถึง: ทุกคน (Anyone)  <-- สำคัญมาก! ต้องเลือก "ทุกคน"
 * 6. กด "ทำให้ใช้งานได้" ➔ กดให้สิทธิ์การเข้าถึง (Authorize) ➔ คัดลอก "URL ของเว็บแอป"
 * 7. นำ URL ที่ได้ไปวางในช่อง "Google Sheets Webhook URL" ในหน้าแดชบอร์ดแอดมิน
 * ============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var payload = JSON.parse(raw);
    var action = payload.action || 'order_approved';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ตรวจสอบและสร้างชีททั้ง 3 แท็บอัตโนมัติหากยังไม่มี
    setupSheetsIfMissing(ss);

    var ordersSheet = ss.getSheetByName('รายการออเดอร์');
    var monthlySheet = ss.getSheetByName('สรุปรายได้รายเดือน');
    var courseSheet = ss.getSheetByName('สรุปรายได้รายคอร์ส');

    if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'เชื่อมต่อ Google Sheets กับ INBIOLOGY Academy สำเร็จสมบูรณ์ 100%!',
        time: new Date().toLocaleString('th-TH')
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'order_approved' && payload.order) {
      appendOrUpdateOrder(ordersSheet, payload.order);
      recalculateMonthlySummary(ordersSheet, monthlySheet);
      recalculateCourseSummary(ordersSheet, courseSheet);
    } else if (action === 'batch_sync' && Array.isArray(payload.orders)) {
      payload.orders.forEach(function(o) {
        appendOrUpdateOrder(ordersSheet, o);
      });
      recalculateMonthlySummary(ordersSheet, monthlySheet);
      recalculateCourseSummary(ordersSheet, courseSheet);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'บันทึกข้อมูลและอัปเดตสรุปยอดรายเดือน/รายคอร์สเรียบร้อยแล้ว'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'INBIOLOGY Academy Google Sheets Sync Service is active.'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SETUP SHEETS & BEAUTIFUL STYLING
// ─────────────────────────────────────────────────────────────────────────────
function setupSheetsIfMissing(ss) {
  // แท็บ 1: รายการออเดอร์ (All Orders)
  var sheet1 = ss.getSheetByName('รายการออเดอร์');
  if (!sheet1) {
    sheet1 = ss.insertSheet('รายการออเดอร์', 0);
    var h1 = [
      'วันที่สั่งซื้อ', 'เวลา', 'รหัสออเดอร์', 'ชื่อนักเรียน', 'อีเมล', 
      'คอร์สที่ซื้อ', 'ยอดชำระจริง (฿)', 'ส่วนลด (฿)', 'โค้ดส่วนลด', 
      'สถานะ', 'ผู้อนุมัติ', 'วันเวลาที่โอนจริงตามสลิป'
    ];
    sheet1.appendRow(h1);
    formatHeaderRow(sheet1, 12, '#1E3A8A');
  }

  // แท็บ 2: สรุปรายได้รายเดือน (Monthly Summary)
  var sheet2 = ss.getSheetByName('สรุปรายได้รายเดือน');
  if (!sheet2) {
    sheet2 = ss.insertSheet('สรุปรายได้รายเดือน', 1);
    var h2 = [
      'เดือน / ปี', 'จำนวนออเดอร์', 'ยอดขายรวม (฿)', 
      'ส่วนลดรวม (฿)', 'ยอดสุทธิ (฿)', 'ยอดเฉลี่ย/ออเดอร์ (฿)', 'สถานะ'
    ];
    sheet2.appendRow(h2);
    formatHeaderRow(sheet2, 7, '#047857');
  }

  // แท็บ 3: สรุปรายได้รายคอร์ส (Course Breakdown)
  var sheet3 = ss.getSheetByName('สรุปรายได้รายคอร์ส');
  if (!sheet3) {
    sheet3 = ss.insertSheet('สรุปรายได้รายคอร์ส', 2);
    var h3 = [
      'ชื่อคอร์สเรียน', 'จำนวนที่ขายได้ (ออเดอร์)', 'ยอดเงินรวม (฿)', 'สัดส่วนยอดขาย (%)'
    ];
    sheet3.appendRow(h3);
    formatHeaderRow(sheet3, 4, '#B91C1C');
  }
}

function formatHeaderRow(sheet, numCols, bgColor) {
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground(bgColor);
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Kanit');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INSERT OR UPDATE SINGLE ORDER
// ─────────────────────────────────────────────────────────────────────────────
function appendOrUpdateOrder(sheet, order) {
  var orderId = String(order.id || '');
  if (!orderId) return;

  var created = new Date(order.created_at || order.createdAt || Date.now());
  var dateStr = Utilities.formatDate(created, 'Asia/Bangkok', 'yyyy-MM-dd');
  var timeStr = Utilities.formatDate(created, 'Asia/Bangkok', 'HH:mm');

  var total = Number(order.total_amount || order.totalAmount || order.price || 0);
  var discount = Number(order.discount_amount || order.discountAmount || 0);
  var coupon = order.coupon_code || order.couponCode || '-';
  var status = order.status === 'approved' ? 'อนุมัติแล้ว' : (order.status === 'pending' ? 'รอตรวจ' : order.status);
  var reviewer = order.reviewed_by || order.reviewedBy || 'Admin';

  var transferInfo = '-';
  if (order.transfer_date && order.transfer_time) {
    transferInfo = order.transfer_date + ' ' + order.transfer_time;
  } else if (order.user_note && order.user_note.indexOf('วันที่โอน:') !== -1) {
    transferInfo = order.user_note.split('|')[0].trim();
  }

  var rowData = [
    dateStr,
    timeStr,
    orderId,
    order.user_name || order.userName || 'ไม่ระบุชื่อ',
    order.user_email || order.userEmail || '',
    order.course_titles || order.courseTitles || (order.course_ids || []).join(', '),
    total,
    discount,
    coupon,
    status,
    reviewer,
    transferInfo
  ];

  // ค้นหาว่ามีออเดอร์นี้ในตารางแล้วหรือไม่ (เพื่อป้องกันข้อมูลซ้ำซ้อน)
  var lastRow = sheet.getLastRow();
  var foundRow = -1;
  if (lastRow > 1) {
    var idCol = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < idCol.length; i++) {
      if (String(idCol[i][0]) === orderId) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 7).setNumberFormat('฿#,##0.00');
    sheet.getRange(newRow, 8).setNumberFormat('฿#,##0.00');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECALCULATE MONTHLY FINANCIAL SUMMARY (สรุปยอดรายเดือนอัตโนมัติ)
// ─────────────────────────────────────────────────────────────────────────────
function recalculateMonthlySummary(ordersSheet, monthlySheet) {
  var lastRow = ordersSheet.getLastRow();
  if (lastRow <= 1) return;

  var data = ordersSheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var monthlyMap = {};

  var now = new Date();
  var currentMonthKey = Utilities.formatDate(now, 'Asia/Bangkok', 'yyyy-MM');

  data.forEach(function(row) {
    var dateVal = row[0]; // yyyy-MM-dd
    var total = Number(row[6]) || 0;
    var discount = Number(row[7]) || 0;
    var status = String(row[9]);

    // นับเฉพาะออเดอร์ที่อนุมัติแล้วเท่านั้น
    if (status !== 'อนุมัติแล้ว' && status !== 'approved') return;

    var monthKey = String(dateVal).substring(0, 7); // yyyy-MM
    if (!monthKey || monthKey.length < 7) monthKey = currentMonthKey;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { orders: 0, gross: 0, discount: 0, net: 0 };
    }
    monthlyMap[monthKey].orders += 1;
    monthlyMap[monthKey].gross += (total + discount);
    monthlyMap[monthKey].discount += discount;
    monthlyMap[monthKey].net += total;
  });

  // ล้างข้อมูลเดิมในแท็บสรุปรายเดือน (ตั้งแต่แถวที่ 2 เป็นต้นไป)
  var curMonthlyLast = monthlySheet.getLastRow();
  if (curMonthlyLast > 1) {
    monthlySheet.getRange(2, 1, curMonthlyLast - 1, 7).clearContent().clearFormat();
  }

  var sortedKeys = Object.keys(monthlyMap).sort().reverse();
  var outputRows = [];
  var totalAllOrders = 0;
  var totalAllGross = 0;
  var totalAllDiscount = 0;
  var totalAllNet = 0;

  var thaiMonths = {
    '01': 'มกราคม', '02': 'กุมภาพันธ์', '03': 'มีนาคม', '04': 'เมษายน',
    '05': 'พฤษภาคม', '06': 'มิถุนายน', '07': 'กรกฎาคม', '08': 'สิงหาคม',
    '09': 'กันยายน', '10': 'ตุลาคม', '11': 'พฤศจิกายน', '12': 'ธันวาคม'
  };

  sortedKeys.forEach(function(key) {
    var parts = key.split('-');
    var yr = parseInt(parts[0], 10) + 543;
    var mo = thaiMonths[parts[1]] || parts[1];
    var label = mo + ' ' + yr + ' (' + key + ')';

    var m = monthlyMap[key];
    var avg = m.orders > 0 ? (m.net / m.orders) : 0;
    var isCurrent = (key === currentMonthKey);
    var statusText = isCurrent ? '🟢 เดือนปัจจุบัน (กำลังรับยอด)' : '🔒 ครบเดือน (สรุปยอดสำเร็จ)';

    outputRows.push([label, m.orders, m.gross, m.discount, m.net, avg, statusText]);

    totalAllOrders += m.orders;
    totalAllGross += m.gross;
    totalAllDiscount += m.discount;
    totalAllNet += m.net;
  });

  if (outputRows.length > 0) {
    monthlySheet.getRange(2, 1, outputRows.length, 7).setValues(outputRows);
    monthlySheet.getRange(2, 3, outputRows.length, 4).setNumberFormat('฿#,##0.00');

    // บรรทัดสรุปยอดรวมทั้งหมดทุกเดือน (Grand Total)
    var grandTotalRow = outputRows.length + 2;
    var avgAll = totalAllOrders > 0 ? (totalAllNet / totalAllOrders) : 0;
    var grandRowData = ['⭐ รวมยอดสะสมทั้งหมด', totalAllOrders, totalAllGross, totalAllDiscount, totalAllNet, avgAll, '✓ สรุปภาพรวม'];
    monthlySheet.getRange(grandTotalRow, 1, 1, 7).setValues([grandRowData]);
    monthlySheet.getRange(grandTotalRow, 1, 1, 7).setFontWeight('bold').setBackground('#ECFDF5');
    monthlySheet.getRange(grandTotalRow, 3, 1, 4).setNumberFormat('฿#,##0.00');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECALCULATE COURSE BREAKDOWN (สรุปยอดขายแยกรายคอร์ส)
// ─────────────────────────────────────────────────────────────────────────────
function recalculateCourseSummary(ordersSheet, courseSheet) {
  var lastRow = ordersSheet.getLastRow();
  if (lastRow <= 1) return;

  var data = ordersSheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var courseMap = {};
  var totalRevenueAllCourses = 0;

  data.forEach(function(row) {
    var coursesText = String(row[5] || 'ไม่ระบุคอร์ส');
    var total = Number(row[6]) || 0;
    var status = String(row[9]);

    if (status !== 'อนุมัติแล้ว' && status !== 'approved') return;

    // แยกคอร์สกรณีสั่งหลายวิชา
    var list = coursesText.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
    if (list.length === 0) list = [coursesText];

    var perCourseAmount = total / list.length;
    list.forEach(function(cName) {
      if (!courseMap[cName]) {
        courseMap[cName] = { count: 0, revenue: 0 };
      }
      courseMap[cName].count += 1;
      courseMap[cName].revenue += perCourseAmount;
    });

    totalRevenueAllCourses += total;
  });

  // ล้างข้อมูลเดิมในแท็บสรุปรายคอร์ส
  var curCourseLast = courseSheet.getLastRow();
  if (curCourseLast > 1) {
    courseSheet.getRange(2, 1, curCourseLast - 1, 4).clearContent().clearFormat();
  }

  var sortedCourses = Object.keys(courseMap).sort(function(a, b) {
    return courseMap[b].revenue - courseMap[a].revenue;
  });

  var rows = [];
  sortedCourses.forEach(function(cName) {
    var c = courseMap[cName];
    var pct = totalRevenueAllCourses > 0 ? (c.revenue / totalRevenueAllCourses) * 100 : 0;
    rows.push([cName, c.count, c.revenue, pct.toFixed(1) + '%']);
  });

  if (rows.length > 0) {
    courseSheet.getRange(2, 1, rows.length, 4).setValues(rows);
    courseSheet.getRange(2, 3, rows.length, 1).setNumberFormat('฿#,##0.00');

    // บรรทัดรวมทุกคอร์ส
    var grandRow = rows.length + 2;
    courseSheet.getRange(grandRow, 1, 1, 4).setValues([
      ['⭐ รวมยอดขายทุกคอร์ส', data.length, totalRevenueAllCourses, '100%']
    ]);
    courseSheet.getRange(grandRow, 1, 1, 4).setFontWeight('bold').setBackground('#EFF6FF');
    courseSheet.getRange(grandRow, 3).setNumberFormat('฿#,##0.00');
  }
}
