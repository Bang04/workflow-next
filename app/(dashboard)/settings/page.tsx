const fields = [
  { label: "Workspace name", value: "Manageko." },
  { label: "Contact email", value: "manag@mail.com" },
];

export default function GeneralSettingsPage() {
  return (
    <form className="flex max-w-md flex-col gap-5">
      {fields.map((field) => (
        <label key={field.label} className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700">
            {field.label}
          </span>
          <input
            defaultValue={field.value}
            className="h-10 rounded-lg border border-zinc-200 px-3 text-sm shadow-xs focus:border-zinc-400 focus:outline-none"
          />
        </label>
      ))}
    </form>
  );
}
