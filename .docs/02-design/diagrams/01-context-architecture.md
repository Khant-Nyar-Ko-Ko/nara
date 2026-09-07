# Diagram 1 — System Context / Architecture

```mermaid
flowchart LR
    subgraph Sources["Thai news websites (F1)"]
        S1[Thai PBS]
        S2[Bangkok Post]
        S3[Matichon]
        S4[...]
    end

    subgraph Backend["NaraNews backend (SEA cloud region)"]
        Fetcher[Fetcher - polls sources on a schedule]
        Summarizer[Summarizer - one-line summary per headline]
        Dispatcher[Dispatcher - picks delivery channel]
        Logs[(Access/traffic log store - LR2, >=90 days)]
    end

    subgraph Client["Chrome"]
        Ext[NaraNews extension]
        Popup[Popup UI - F2]
    end

    Email[Email service]
    Reader((Reader))

    S1 & S2 & S3 & S4 --> Fetcher
    Fetcher --> Summarizer
    Summarizer --> Dispatcher
    Dispatcher -->|Chrome active| Ext
    Ext --> Popup
    Dispatcher -->|Chrome inactive - F3, gated by LR1/LR3/LR4| Email
    Popup --> Reader
    Email --> Reader
    Fetcher -.logs.-> Logs
    Dispatcher -.logs.-> Logs
```

Every backend entry point (fetch trigger, dispatch trigger) writes to the LR2 access log. F3's email path is
gated on LR1 (purpose-limited use), LR3 (verified identity), and LR4 (recorded consent) — shown as annotations
here rather than separate boxes to keep the diagram at system-context level.
