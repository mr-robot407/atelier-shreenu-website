import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// Load .env.local manually
const env = readFileSync(".env.local", "utf-8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const db = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE_NAME;

const posts = [
  {
    title: "The Quiet Language of Stone",
    slug: "quiet-language-of-stone",
    excerpt:
      "How raw stone — travertine, slate, quartzite — becomes the emotional backbone of a room when used with restraint.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=533&fit=crop",
    tags: ["design"],
    content: `<h2>Stone as a material memory</h2><p>There is something irreducible about stone. Unlike wood, which carries the warmth of living growth, or plaster, which can be shaped endlessly, stone arrives with its own story — a compressed geological time that no human hand fully authors.</p><p>In our practice, we have found that the most successful stone applications are not those that make the material the loudest voice in the room, but those that allow it to anchor. A low travertine wall in a living room does not demand attention. It earns it — slowly, as the light moves across its surface and reveals the fossils and strata locked inside.</p><h2>Choosing the right stone for a space</h2><p>The selection process begins not with aesthetics but with light. A north-facing room in Delhi will receive a cooler, flatter light that suits lighter stones — white marble, pale quartzite. A south-facing room, flooded with warm afternoon sun, can absorb darker materials: black granite, aged limestone.</p><p>The second consideration is tactility. Stone that will be touched — a kitchen counter, a bathroom ledge, a fireplace surround — must reward the hand as much as the eye. Honed finishes, rather than polished, tend to feel more honest and age more gracefully.</p><h2>Restraint as a design principle</h2><p>The temptation with stone is excess. To tile an entire floor, clad every wall, fill every surface. We resist this. One strong stone moment per room — one material that speaks clearly — is almost always more powerful than a chorus of competing stones.</p>`,
  },
  {
    title: "Designing for Stillness",
    slug: "designing-for-stillness",
    excerpt:
      "In a culture of acceleration, the interiors that endure are those designed to slow you down. Notes on pace, pause, and spatial intention.",
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=533&fit=crop",
    tags: ["architecture"],
    content: `<h2>The problem with busy spaces</h2><p>Most interiors are designed to impress on first contact — and then slowly exhaust the people who live in them. The visual complexity that photographs beautifully becomes, in daily life, a low-grade noise that prevents rest.</p><p>We have become increasingly interested in the opposite: spaces that do not perform. Rooms that reveal themselves slowly, that change with the quality of morning versus evening light, that give the inhabitant something to notice only after months of living.</p><h2>Pace as a design element</h2><p>Stillness in an interior is not emptiness. It is a careful calibration of pace — how quickly the eye moves through a room, how many decisions it is asked to make, how much it can rest before encountering the next point of interest.</p><p>A long corridor with a single artwork at its end forces a kind of meditative walk. A kitchen with clean, handleless cabinetry removes the visual stutter of hardware. A bedroom with no overhead lighting — only wall sconces and a bedside lamp — keeps the ceiling as a place of rest, not illumination.</p><h2>Materials that age into stillness</h2><p>Some materials are inherently still. Limewash walls absorb light rather than reflecting it. Raw linen upholstery softens over years rather than wearing out. Oiled oak darkens in a way that feels earned. These are materials that move in the same direction as time — toward depth rather than toward decline.</p>`,
  },
  {
    title: "The Reference File: Japan",
    slug: "reference-file-japan",
    excerpt:
      "A collection of spatial references from a studio trip — not to copy, but to understand what restraint actually looks like when a culture has practiced it for centuries.",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=533&fit=crop",
    tags: ["references"],
    content: `<h2>What we went to learn</h2><p>We did not go to Japan to import its aesthetics. The risk of copying without understanding is well documented — the result is pastiche, a surface without a substrate. We went instead to observe how a culture with a deep tradition of spatial discipline actually inhabits its spaces. How function and beauty are not in tension but are the same thing expressed differently.</p><h2>The engawa</h2><p>The transitional space between inside and outside — the engawa — struck us most forcefully. It is not quite a room, not quite a garden. It is a pause. A place where you remove your shoes, where the light is different, where the temperature is between the two climates it connects.</p><p>In Indian homes, we have always had versions of this — the verandah, the jharokha, the courtyard. But we have largely abandoned them in contemporary construction. The engawa reminded us that these transitional spaces are not luxuries but necessities for how bodies relate to buildings.</p><h2>Joinery as respect</h2><p>Japanese woodwork is famous for its precision — joints that fit without nails, connections that are stronger for being designed rather than fastened. What struck us less visibly is the attitude this represents: that the connection between two pieces of material deserves as much attention as the pieces themselves. It is a lesson we carry back into how we detail our built-in furniture and cabinetry.</p>`,
  },
  {
    title: "Light Before Furniture",
    slug: "light-before-furniture",
    excerpt:
      "The single most common mistake in residential interiors is treating lighting as a finishing decision. It is a structural one.",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=533&fit=crop",
    tags: ["design"],
    content: `<h2>The lighting afterthought</h2><p>In almost every project we inherit — renovations, second-phase work, spaces designed by others — the lighting tells the same story. A grid of recessed downlights, placed on a reflected ceiling plan that was drawn after all the other decisions were made. Sometimes a chandelier in the dining room. Occasionally, a floor lamp.</p><p>The result is a space that is technically illuminated but experientially flat. No depth. No mystery. No capacity for the room to change its character between morning and midnight.</p><h2>Thinking in layers</h2><p>Lighting design begins with identifying what each layer of a room should do. Ambient light establishes the general tone and prevents darkness — it should be subtle, not harsh. Task light serves specific functions: reading, cooking, grooming. It can be brighter, more directed. Accent light sculpts objects and surfaces, creates shadow, makes a room three-dimensional.</p><p>Most residential lighting delivers only ambient. The other two layers — the ones that make a room feel alive — are added as afterthoughts, if at all.</p><h2>The wall as a light source</h2><p>One of the most transformative interventions in any room is the wall wash: a light source positioned to graze across a wall's surface, revealing its texture. Limewash, plaster, stone, timber — none of these materials are flat, and none of them look alive under direct overhead light. They come alive when light crosses them at an angle, when you can see the material breathing.</p>`,
  },
  {
    title: "A Year of Studio Notes",
    slug: "a-year-of-studio-notes",
    excerpt:
      "Fragments from twelve months of practice — observations from sites, conversations with craftspeople, and the questions that stayed with us.",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=533&fit=crop",
    tags: ["studio-life"],
    content: `<h2>January — On starting</h2><p>Every project begins with a conversation that is not about design. It is about how the client lives — what time they wake, whether they cook or order in, whether they have people over or retreat inward, whether they read in bed or never open a book. The design comes from this. Not from references, not from Pinterest, not from what we have done before.</p><h2>March — From a site visit in Chattarpur</h2><p>The farmer who owned the land before our client had planted a row of old neem trees along the south boundary. Our first instinct was to design around them. Our second instinct — the right one — was to design for them. The living room now faces south, framed on either side by the tree line. In summer, the canopy provides complete shade. In winter, the bare branches let the low sun through entirely. The trees do the work of a sophisticated shading system, for free, and with more beauty than anything we could have built.</p><h2>July — On craft</h2><p>We visited the workshop of a stone carver in Agra who has been working with one family of craftsmen for three generations. He showed us a panel he had spent six weeks on — a low-relief carving of water, in white marble. The movement in the stone was extraordinary. Not decorative. Structural. The carving changed how light moved across the surface of the entire room it was destined for.</p><p>We talk often about handcraft in the abstract — its value, its place in contemporary interiors. Standing in that workshop, the abstraction dissolved. This is what we mean.</p><h2>November — The project that taught us the most</h2><p>A 900 square foot apartment in south Delhi. Tiny by our usual scale. A single woman, recently divorced, starting over. She had almost no furniture and very little brief beyond: make it feel like mine.</p><p>We stripped the walls to bare plaster and left them. We put in a kitchen with no upper cabinets — just open shelving with handmade clay pots. We found one rug that cost more than everything else combined. We hung a single large photograph that she had taken herself, on a trip she had taken alone after the divorce.</p><p>It is one of the most complete rooms we have ever made.</p>`,
  },
];

async function seed() {
  for (const post of posts) {
    const postId = randomUUID();
    const createdAt = new Date().toISOString();
    const publishedAt = new Date().toISOString();

    await db.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          ...post,
          postId,
          createdAt,
          publishedAt,
          status: "published",
        },
      })
    );

    console.log(`✓ Created: ${post.title}`);
  }
  console.log("\nDone — 5 posts seeded.");
}

seed().catch(console.error);
