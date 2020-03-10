function(o) {
    //Điều kiện hiển thị đơn:
    //- Null: hiển thị lên màn hình
    //- 0 / 1: không hiển thị(0: trong giờ làm việc, 1: ngoài giờ làm việc)

    const hh = new Date().getHours();
    if (hh >= 8 && hh <= 22) return 0;
    return 1;
}