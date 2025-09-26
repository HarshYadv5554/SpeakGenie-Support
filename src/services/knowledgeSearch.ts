import { knowledgeBase } from '../data/knowledgeBase';
import { KnowledgeItem } from '../types';

export class KnowledgeSearchService {
  searchRelevantKnowledge(query: string, limit: number = 3): string[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Score each knowledge item based on relevance
    const scoredItems = knowledgeBase.map(item => {
      let score = 0;
      
      // Check question match
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Check keyword matches
      item.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 5;
        }
      });
      
      // Check individual word matches
      queryWords.forEach(word => {
        if (item.question.toLowerCase().includes(word) || 
            item.answer.toLowerCase().includes(word) ||
            item.keywords.some(k => k.toLowerCase().includes(word))) {
          score += 2;
        }
      });
      
      return { item, score };
    });
    
    // Sort by score and return top results
    return scoredItems
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => `Q: ${item.question}\nA: ${item.answer}`);
  }
  
  findExactMatch(query: string): KnowledgeItem | null {
    const queryLower = query.toLowerCase();
    return knowledgeBase.find(item => 
      item.question.toLowerCase() === queryLower ||
      item.keywords.some(keyword => keyword.toLowerCase() === queryLower)
    ) || null;
  }
}