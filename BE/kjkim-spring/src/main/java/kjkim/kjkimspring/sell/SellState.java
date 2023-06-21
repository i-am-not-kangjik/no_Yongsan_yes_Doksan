package kjkim.kjkimspring.sell;

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

    public static SellState fromString(String status) {
        for (SellState state : SellState.values()) {
            if (state.status.equalsIgnoreCase(status)) {
                return state;
            }
        }
        throw new IllegalArgumentException("Invalid Sell State: " + status);
    }
}



