export const ASCII_ART = `  trace_id  c0ffeebada555ca1ab1e0ddba11cafe0
  status    200 OK
  ----------------------------------------------
  you           |##############################|  <- root span
    gateway     |.############################.|
      auth      |..####........................|
      service   |.......##################.....|
        db      |..........##########..........|`;

export const GREETING = `You found the part of this site that isn't in the sitemap.

Most visitors never open the console. The ones who do are usually
people I'd like to work with: curious, a little suspicious, reading
the logs when nobody asked them to.

Every trace has a root span. In this one, it's you.

If you build things, break things, or just like talking shop about
reliable systems, say hello:

  hello@bjurado.com

(type brandon.help() for more)`;

export const HELP = `brandon.help()

  whoami()   who's behind this site
  stack()    what I work with
  email()    copy my email address`;

export const WHOAMI = `Brandon Jurado
Senior software engineer, Austin TX. Backend, mostly Java.`;

export const STACK = `Java, Kotlin, TypeScript
Spring Boot, Kafka, MySQL, DynamoDB
AWS, Terraform, Docker, Kubernetes, Datadog`;

export const EMAIL = "hello@bjurado.com";
export const EMAIL_COPIED = "Copied hello@bjurado.com to your clipboard.";
export const EMAIL_COPY_FAILED =
  "Couldn't reach the clipboard from here. Copy it by hand: hello@bjurado.com";

export const GREETING_STYLE =
  "color: #4F86E8; font-size: 16px; font-weight: bold;";
export const EMAIL_STYLE = "color: #4F86E8; font-weight: bold;";
