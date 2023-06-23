package kjkim.kjkimspring.sell;

// 판매 상태를 나타내는 Enum 클래스입니다. 상품이 판매 중인지, 예약 중인지, 판매가 완료되었는지를 표현합니다.
public enum SellState {
    SELLING("selling"),
    RESERVED("reserved"),
    COMPLETED("completed");

    private String status;

    SellState(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    // 문자열을 입력 받아 해당 문자열에 대응되는 판매 상태를 반환합니다.
    public static SellState fromString(String status) {
        for (SellState state : SellState.values()) {
            if (state.status.equalsIgnoreCase(status)) {
                return state;
            }
        }
        throw new IllegalArgumentException("Invalid Sell State: " + status);
    }
}



