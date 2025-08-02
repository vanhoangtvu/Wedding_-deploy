package com.thiepCuoi.service;

import java.util.Map;

public interface TemplateRenderService {
    /**
     * Render HTML template với custom data
     * @param htmlTemplate HTML template với placeholders như {{groom_name}}
     * @param customData Map chứa dữ liệu để thay thế placeholders
     * @return HTML đã được render
     */
    String renderHtml(String htmlTemplate, Map<String, String> customData);
    
    /**
     * Render CSS template với custom data (nếu cần)
     * @param cssTemplate CSS template
     * @param customData Map chứa dữ liệu để thay thế
     * @return CSS đã được render
     */
    String renderCss(String cssTemplate, Map<String, String> customData);
    
    /**
     * Validate template variables
     * @param templateVariables JSON string chứa các biến template
     * @param customData Map chứa dữ liệu user nhập
     * @return true nếu valid
     */
    boolean validateTemplateData(String templateVariables, Map<String, String> customData);
}