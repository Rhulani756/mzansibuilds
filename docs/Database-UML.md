# Database Entity-Relationship Diagram

Below is the UML database design mapping the relationships between Users, Projects, Milestones, and Comments.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "creates"
    USER ||--o{ COMMENT : "writes"
    
    PROJECT ||--o{ MILESTONE : "tracks"
    PROJECT ||--o{ COMMENT : "receives"
    
    USER {
        uuid id PK
        string name
        string email
        string passwordHash
        datetime createdAt
    }
    
    PROJECT {
        uuid id PK
        string title
        string description
        string stage
        string supportRequired
        boolean isCompleted
        uuid userId FK
        datetime createdAt
    }
    
    MILESTONE {
        uuid id PK
        string title
        string description
        uuid projectId FK
        datetime achievedAt
    }
    
    COMMENT {
        uuid id PK
        string text
        boolean isCollabReq
        uuid userId FK
        uuid projectId FK
        datetime createdAt
    }