# Diagram 3 — Use Case

```mermaid
flowchart TB
    Reader((Thai news reader))

    subgraph NaraNews["NaraNews - in scope this phase"]
        UC1(("View aggregated\nheadline feed - F1"))
        UC2(("Scan one-line\nsummaries - F2"))
        UC3(("Jump to source\narticle - F2"))
        UC4(("Receive email digest\nwhen away from Chrome - F3"))
        UC5(("Consent to email\ndelivery - LR4"))
    end

    subgraph Future["Not in scope this phase"]
        UC6(("Get followed-up on\nbreaking news - F4, Won't"))
    end

    Reader --- UC1
    Reader --- UC2
    Reader --- UC3
    Reader --- UC4
    Reader --- UC5
    Reader -.-> UC6

    UC4 -.includes.-> UC5
    UC2 -.includes.-> UC3
```

UC5 (consent) is drawn as `includes` on UC4 because F3 cannot legally fire for a reader until LR1/LR3/LR4 are
satisfied — consent isn't a separate feature the reader seeks out, it's a precondition of the email use case.
