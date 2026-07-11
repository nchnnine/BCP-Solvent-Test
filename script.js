// 1. ระบบ ค้นหา Solvent ที่เหมาะกับธุรกิจ (Dynamic Finder)
const solventData = {
    rubber: {
        name: "Solvent 80/100",
        desc: "โดดเด่นด้วยจุดวาบไฟที่ต่ำทำให้ระเหยตัวได้เร็วมาก นิยมนำไปใช้เป็นตัวทำละลายหลักในอุตสาหกรรมผลิตยางรถยนต์ โรงงานผลิตเรซิ่น และกลุ่มอุตสาหกรรมสีระเหยเร็วเพื่อเพิ่มประสิทธิภาพการยึดเกาะและแห้งตัว"
    },
    extraction: {
        name: "Hexane",
        desc: "เหมาะสำหรับอุตสาหกรรมสกัดน้ำมันพืชจากธรรมชาติ เช่น การสกัดน้ำมันถั่วเหลือง หรือน้ำมันรำข้าว นอกจากนี้ยังมีคุณสมบัติพิเศษในอุตสาหกรรมกาว ช่วยให้เนื้อกาวทำละลายได้สมบูรณ์และแห้งตัวเร็วเป็นพิเศษ"
    },
    paint: {
        name: "White Spirit 3040",
        desc: "ออกแบบมาเฉพาะสำหรับกลุ่มอุตสาหกรรมสีทาบ้านและสีทาอาคาร (กลุ่ม TOA) จัดอยู่ในกลุ่ม 'Slow solvent' ที่ระเหยช้าและไม่ทิ้งคราบสกปรก ช่วยให้โพลิเมอร์ (Polymer) ที่ใช้เกาะกับปูนสามารถทำละลายและเซ็ตตัวได้อย่างสม่ำเสมอและทนทาน"
    },
    oilgas: {
        name: "Solvent D80",
        desc: "สารทำละลายสารพัดประโยชน์ ปลอดภัยสูง นิยมใช้ในสินค้าอุปโภคบริโภค เช่น สเปรย์ปรับอากาศ และหัวใจสำคัญในอุตสาหกรรมน้ำมันและก๊าซ (Oil & Gas) สำหรับงานขุดเจาะน้ำมัน (Mud Engineering) เพื่อทำหน้าที่อุดส่วนที่เจาะสำรวจป้องกันแรงดันและคัดกรองชั้นน้ำมัน"
    }
};

document.getElementById('industrySelector').addEventListener('change', function() {
    const selectedValue = this.value;
    const resultBox = document.getElementById('finderResult');
    const nameEl = document.getElementById('recommendedSolventName');
    const descEl = document.getElementById('recommendedSolventDesc');

    if (solventData[selectedValue]) {
        nameEl.textContent = solventData[selectedValue].name;
        descEl.textContent = solventData[selectedValue].desc;
        
        // แสดงกล่องผลลัพธ์พร้อมรีเซ็ตแอนิเมชัน
        resultBox.style.display = 'block';
        resultBox.style.animation = 'none';
        resultBox.offsetHeight; /* Trigger reflow */
        resultBox.style.animation = null;
    }
});


// 2. ระบบเชื่อมต่อฟอร์มเข้า Google Sheets และส่งอีเมลหาทีม Sales
// ** ให้เอา URL ที่ได้จาก Google Apps Script ในสเต็ปที่ 4 มาใส่ที่นี่ **
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2fBTZbmf-qXYAPhlJ70rEwx2xuTPMkqV3k1Rpe-BGHHlIkl0FmHh8BOd3hXctKTfw8A/exec";

document.getElementById('b2bForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = "กำลังส่งข้อมูลขอใบเสนอราคา...";
    submitBtn.disabled = true;

    // รวบรวมข้อมูลจาก Form
    const formData = new FormData();
    formData.append("name", this.querySelector('input[placeholder*="ชื่อ-นามสกุล"]').value);
    formData.append("company", this.querySelector('input[placeholder*="ชื่อบริษัท"]').value);
    formData.append("phone", this.querySelector('input[placeholder*="เบอร์โทรศัพท์"]').value);
    
    const industryEl = this.querySelector('select:not(#interestedProduct)'); // ดึงค่าจากช่องอุตสาหกรรม
    formData.append("industry", industryEl.options[industryEl.selectedIndex].text);
    
    const productEl = this.querySelector('#interestedProduct'); // ดึงค่าจากช่องผลิตภัณฑ์
    formData.append("product", productEl.options[productEl.selectedIndex].text);
    
    formData.append("volume", this.querySelector('#expectedVolume').value); // ดึงค่า Volume
    // ส่งข้อมูลไปยัง Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.result === "success") {
            alert('บันทึกข้อมูลสำเร็จ! ระบบได้ส่งข้อมูลให้ทีม Sales BCP เรียบร้อยแล้ว เราจะติดต่อกลับท่านโดยเร็วที่สุด');
            document.getElementById('b2bForm').reset();
        } else {
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง หรือติดต่อเราโดยตรง');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    })
    .finally(() => {
        submitBtn.textContent = "ส่งข้อมูลขอใบเสนอราคา";
        submitBtn.disabled = false;
    });
});

// Smooth scrolling ของแถบเมนู
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});