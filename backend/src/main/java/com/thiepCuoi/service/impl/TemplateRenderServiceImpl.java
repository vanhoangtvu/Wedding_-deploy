package com.thiepCuoi.service.impl;

import com.thiepCuoi.service.TemplateRenderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TemplateRenderServiceImpl implements TemplateRenderService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public String renderHtml(String htmlTemplate, Map<String, String> customData) {
        if (htmlTemplate == null || customData == null) {
            return htmlTemplate;
        }
        
        String renderedHtml = htmlTemplate;
        
        // Replace placeholders như {{groom_name}}, {{bride_name}}, etc.
        Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");
        Matcher matcher = pattern.matcher(htmlTemplate);
        
        while (matcher.find()) {
            String placeholder = matcher.group(0); // {{groom_name}}
            String variableName = matcher.group(1).trim(); // groom_name
            
            String value = customData.getOrDefault(variableName, "");
            
            // HTML escape để tránh XSS
            value = escapeHtml(value);
            
            renderedHtml = renderedHtml.replace(placeholder, value);
        }
        
        return renderedHtml;
    }
    
    @Override
    public String renderCss(String cssTemplate, Map<String, String> customData) {
        if (cssTemplate == null || customData == null) {
            return cssTemplate;
        }
        
        String renderedCss = cssTemplate;
        
        // CSS cũng có thể có variables như {{primary_color}}
        Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");
        Matcher matcher = pattern.matcher(cssTemplate);
        
        while (matcher.find()) {
            String placeholder = matcher.group(0);
            String variableName = matcher.group(1).trim();
            
            String value = customData.getOrDefault(variableName, "");
            renderedCss = renderedCss.replace(placeholder, value);
        }
        
        return renderedCss;
    }
    
    @Override
    public boolean validateTemplateData(String templateVariables, Map<String, String> customData) {
        if (templateVariables == null || templateVariables.trim().isEmpty()) {
            return true; // No validation needed
        }
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> requiredVariables = objectMapper.readValue(templateVariables, Map.class);
            
            // Kiểm tra các required fields
            for (String requiredField : requiredVariables.keySet()) {
                if (!customData.containsKey(requiredField)) {
                    return false;
                }
                
                String value = customData.get(requiredField);
                if (value == null || value.trim().isEmpty()) {
                    // Some fields might be optional, check if it's marked as required
                    if (isRequiredField(requiredField)) {
                        return false;
                    }
                }
            }
            
            return true;
        } catch (Exception e) {
            // JSON parsing error
            return false;
        }
    }
    
    private boolean isRequiredField(String fieldName) {
        // Define which fields are required
        return fieldName.equals("groom_name") || fieldName.equals("bride_name") || fieldName.equals("wedding_date");
    }
    
    private String escapeHtml(String input) {
        if (input == null) {
            return "";
        }
        
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;")
                .replace("/", "&#x2F;");
    }
}