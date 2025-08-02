package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class OrderItemDTO {
    @NotNull(message = "ID thiệp tùy chỉnh không được để trống")
    private Long customInvitationId;
    
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
    
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    
    // Thông tin thiệp để hiển thị
    private String groomName;
    private String brideName;
    private String templateName;
    
    // Constructors
    public OrderItemDTO() {}
    
    public OrderItemDTO(Long customInvitationId, Integer quantity) {
        this.customInvitationId = customInvitationId;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public Long getCustomInvitationId() { return customInvitationId; }
    public void setCustomInvitationId(Long customInvitationId) { this.customInvitationId = customInvitationId; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public String getGroomName() { return groomName; }
    public void setGroomName(String groomName) { this.groomName = groomName; }
    
    public String getBrideName() { return brideName; }
    public void setBrideName(String brideName) { this.brideName = brideName; }
    
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
}