public with sharing class endlessScrollHandler {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getNextContacts(List<String> selectedContactIds) {
        return [SELECT Id, Name, Title, Phone, Email
                FROM Contact 
                WHERE Id NOT IN: selectedContactIds LIMIT 30];
    }
}
