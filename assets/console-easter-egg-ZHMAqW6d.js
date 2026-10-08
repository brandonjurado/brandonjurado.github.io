const a=`  trace_id  c0ffeebada555ca1ab1e0ddba11cafe0
  status    200 OK
  ----------------------------------------------
  you           |##############################|  <- root span
    gateway     |.############################.|
      auth      |..####........................|
      service   |.......##################.....|
        db      |..........##########..........|`,r=`You found the part of this site that isn't in the sitemap.

Most visitors never open the console. The ones who do are usually
people I'd like to work with: curious, a little suspicious, reading
the logs when nobody asked them to.

Every trace has a root span. In this one, it's you.

If you build things, break things, or just like talking shop about
reliable systems, say hello:

  hello@bjurado.com

(type brandon.help() for more)`,s=`brandon.help()

  whoami()   who's behind this site
  stack()    what I work with
  email()    copy my email address`,i=`Brandon Jurado
Senior software engineer, Austin TX. Backend, mostly Java.`,l=`Java, Kotlin, TypeScript
Spring Boot, Kafka, MySQL, DynamoDB
AWS, Terraform, Docker, Kubernetes, Datadog`,t="hello@bjurado.com",c="Copied hello@bjurado.com to your clipboard.",d="Couldn't reach the clipboard from here. Copy it by hand: hello@bjurado.com",h="color: #4F86E8; font-size: 16px; font-weight: bold;",p="color: #4F86E8; font-weight: bold;";let n=!1;const e=o=>o.replace(/%/g,"%%");function u(){if(typeof window>"u"||n)return;n=!0;const o=e(r).replace(`
`,`%c
`).replace(t,`%c${t}%c`);console.log(`${e(a)}

%c${o}`,h,"",p,"")}function b(){typeof window>"u"||Object.prototype.hasOwnProperty.call(window,"brandon")||Object.defineProperty(window,"brandon",{value:Object.freeze({help(){console.log(e(s))},whoami(){console.log(e(i))},stack(){console.log(e(l))},email(){(async()=>{let o=c;try{await navigator.clipboard.writeText(t)}catch{o=d}console.log(e(o))})()}}),enumerable:!1})}export{b as installBrandonApi,u as printConsoleGreeting};
