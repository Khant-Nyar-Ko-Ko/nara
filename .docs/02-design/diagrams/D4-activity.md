# D4 — Activity: Catch up on today's Thai news (month-2 scope)

This diagram follows one scenario from start to end. Its steps match [user-journey.md](../user-journey.md) in the same order, and it covers F1, F2 and F3. The decision is the real F2/F3 branch: if the reader is in Chrome they get the popup, and if they're away they get the email.

```mermaid
flowchart TB
    Start(( ))
    Arrive("New one-line headlines are ready")
    Active{"Reader active<br/>in Chrome?"}
    Email("Digest email arrives on phone<br/>(step 1)")
    Open("Open the email<br/>(step 2)")
    Icon("Click NaraNews icon<br/>in Chrome")
    Merge{ }
    List("See one line per story,<br/>from several Thai news sites (step 2)")
    Scroll("Scroll and read<br/>only the one-liners (step 3)")
    Tap("Tap a headline<br/>(step 4)")
    Article("Full story opens on<br/>the news site (step 5)")
    More{"Read another<br/>headline?"}
    Close("Close the list —<br/>caught up (step 5)")
    End((( )))

    Start --> Arrive --> Active
    Active -->|"[no — away]"| Email --> Open --> Merge
    Active -->|"[yes]"| Icon --> Merge
    Merge --> List --> Scroll --> Tap --> Article --> More
    More -->|"[yes] go back to the list"| Scroll
    More -->|"[no]"| Close --> End

    classDef node fill:#16202B,stroke:#4A7BC8,stroke-width:2px,color:#FFFFFF;
    classDef dec fill:#16202B,stroke:#E0B341,stroke-width:2px,color:#FFFFFF;
    classDef start fill:#5FB3A1,stroke:#5FB3A1,color:#5FB3A1;
    classDef stop fill:#5FB3A1,stroke:#0F1620,stroke-width:5px,color:#5FB3A1;
    class Arrive,Email,Open,Icon,List,Scroll,Tap,Article,Close node;
    class Active,Merge,More dec;
    class Start start;
    class End stop;
```

**Legend:**
- **● (filled circle):** start.
- **◉ (circle with a ring):** end.
- **Rounded box:** an action.
- **◆ (gold diamond with a question):** a decision.
- **◆ (empty gold diamond):** a merge, where the branches join again.
- **[brackets]:** a guard, the condition for taking that branch.

**Precondition:** the reader has already signed in with the emailed code (LR3) and agreed to the Terms and Privacy Policy (LR4). Without both, the [no — away] branch sends nothing.
